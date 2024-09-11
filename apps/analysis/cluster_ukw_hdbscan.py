import os
import pandas as pd
import numpy as np
from hdbscan import HDBSCAN
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv
import scipy.sparse as sp
from sklearn.preprocessing import normalize
from pynndescent import NNDescent

# Load environment variables
load_dotenv()

# Connect to PostgreSQL
database_url = os.getenv('DATABASE_URL')
engine = create_engine(
    database_url,
    connect_args={'connect_timeout': 3000},
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20,
    pool_timeout=360,
    pool_recycle=3600,
)

print("Connected to the database")

# Define file paths for fetching and clustering results
fetch_output_file = './data/unique_keywords.csv'
cluster_output_file = './data/cluster_results.csv'

# Check if the unique keywords file already exists
if os.path.exists(fetch_output_file):
    print("Loading data from existing file...")
    df = pd.read_csv(fetch_output_file)

    # Convert vectors back to numpy arrays if loaded from CSV
    df['vector'] = df['vector'].apply(lambda x: np.fromstring(x.strip('[]'), sep=' ') if x.strip('[]') else np.array([]))
    vectors = np.array(df['vector'].tolist())

    print(f"Data loaded from file with {len(df)} rows and vectors parsed")
else:
    print("Fetching data from the database...")

    # Fetch all data with non-empty vectors and additional columns
    query = 'SELECT "id", "vector", "semanticName", "category" FROM "UniqueKeyword" WHERE "vector" IS NOT NULL'
    
    try:
        df = pd.read_sql(query, con=engine)
        print(f"Data loaded with {len(df)} rows")

        # Check if the dataframe is empty
        if df.empty:
            print("Warning: No data was fetched from the database. Check your query or database content.")
        
        # Convert vectors to a suitable format
        df['vector'] = df['vector'].apply(lambda x: np.fromstring(x.strip('{}'), sep=','))
        print("Vectors converted")

        # Save the fetched data to a file to avoid refetching if needed
        df.to_csv(fetch_output_file, index=False)
        print(f"Data saved to {fetch_output_file}")

    except Exception as e:
        print(f"Error while fetching data: {e}")

# Iterate over unique categories and cluster separately
results = []

for category in df['category'].unique():
    print(f"Processing category: {category}")
    category_df = df[df['category'] == category].copy()

    # Ensure vectors are normalized
    vectors = np.array(category_df['vector'].tolist())
    vectors = normalize(vectors)

    if len(vectors) > 0:
        # Compute approximate nearest neighbors with PyNNDescent
        print("Computing approximate nearest neighbors...")
        index = NNDescent(vectors, metric='cosine', n_jobs=-1)
        knn_indices, knn_distances = index.neighbor_graph

        # Construct a sparse distance matrix
        print("Constructing a sparse distance matrix...")
        sparse_distance_matrix = sp.csr_matrix(
            (knn_distances.flatten(), (np.repeat(np.arange(knn_indices.shape[0]), knn_indices.shape[1]), knn_indices.flatten())),
            shape=(len(vectors), len(vectors))
        )

        # Ensure all distances are finite
        if not np.all(np.isfinite(sparse_distance_matrix.data)):
            raise ValueError("Distance matrix contains non-finite values.")

        # Perform clustering
        print(f"Performing clustering on the sparse matrix for category {category}...")
        clusterer = HDBSCAN(
            metric='precomputed',
            min_cluster_size=3,
            min_samples=1,
            cluster_selection_method='eom'
        )
        category_df['cluster'] = clusterer.fit_predict(sparse_distance_matrix)
        print(f"Clustering done for category {category}")

        # Calculate the size of each cluster
        cluster_sizes = category_df['cluster'].value_counts().reset_index()
        cluster_sizes.columns = ['cluster', 'size']

        # Merge cluster sizes with the original DataFrame
        category_df = category_df.merge(cluster_sizes, on='cluster', how='left')

        # Append to results
        results.append(category_df)

# Concatenate all results
final_df = pd.concat(results, ignore_index=True)

# Sort by category, then by cluster size in descending order, and place noise (-1) clusters last
final_df['is_noise'] = (final_df['cluster'] == -1).astype(int)  # Create a helper column to sort noise clusters last
final_df.sort_values(by=['category', 'is_noise', 'size', 'cluster'], ascending=[True, True, False, False], inplace=True)

# Drop the helper column used for sorting
final_df.drop(columns=['is_noise'], inplace=True)

# Save the clustering results back to the file, including semanticName, category, and cluster size
final_df[['id', 'semanticName', 'category', 'cluster', 'size']].to_csv(cluster_output_file, index=False)
print(f"Clustering results saved to {cluster_output_file} and sorted by category, cluster size, and noise")

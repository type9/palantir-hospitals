import os
import pandas as pd
import numpy as np
from sklearn.cluster import MiniBatchKMeans
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv

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
        vectors = np.array(df['vector'].tolist())

        print("Vectors converted")

        # Save the fetched data to a file to avoid refetching if needed
        df.to_csv(fetch_output_file, index=False)
        print(f"Data saved to {fetch_output_file}")

    except Exception as e:
        print(f"Error while fetching data: {e}")

# Check if vectors are correctly parsed
if 'vectors' in locals() and len(vectors) > 0:
    # Perform clustering on the entire dataset
    print("Performing MiniBatch KMeans Clustering...")
    mb_kmeans = MiniBatchKMeans(
        n_clusters=500,  # Adjust the number of clusters based on your needs
        batch_size=1000,  # Adjust batch size based on available memory
        random_state=42
    )

    df['cluster'] = mb_kmeans.fit_predict(vectors)
    print("MiniBatch KMeans Clustering done")

    # Calculate cluster sizes
    cluster_sizes = df['cluster'].value_counts().reset_index()
    cluster_sizes.columns = ['cluster', 'size']

    # Merge cluster sizes with the original dataframe
    df = df.merge(cluster_sizes, on='cluster')

    # Sort the dataframe by cluster size in descending order
    df = df.sort_values(by='size', ascending=False)

    # Save the clustering results back to the file, including semanticName, category, and cluster size
    df[['id', 'semanticName', 'category', 'cluster', 'size']].to_csv(cluster_output_file, index=False)
    print(f"Clustering results saved to {cluster_output_file} sorted by cluster sizes")
else:
    print("No valid vectors were found for clustering. Please check the fetched data.")

import os
import pandas as pd
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

# Define the file path for clustering results
cluster_output_file = './data/cluster_results.csv'

# Check if the clustering results file exists
if os.path.exists(cluster_output_file):
    print("Loading clustering results from file...")
    df = pd.read_csv(cluster_output_file)
    print(f"Clustering results loaded with {len(df)} rows")

    # Prepare data for insertion
    upload_data = df[['id', 'cluster', 'category']].copy()
    upload_data = upload_data.rename(columns={'id': 'keywordId'})  # Rename columns to match the Prisma schema

    # Insert data into the database
    try:
        print("Uploading clustering results to the database...")
        upload_data.to_sql('UniqueKeywordClusterResult', con=engine, if_exists='append', index=False)
        print("Clustering results uploaded successfully")

    except Exception as e:
        print(f"Error while uploading data: {e}")

else:
    print(f"Clustering results file {cluster_output_file} does not exist. Please check the file path.")

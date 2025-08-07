
import pandas as pd

# Load data
df = pd.read_csv('../data/sales_data.csv')

# Basic cleaning
df.dropna(inplace=True)
df['Date'] = pd.to_datetime(df['Date'])

# Save cleaned data
df.to_csv('../data/sales_data_cleaned.csv', index=False)
print("Data cleaned and saved.")

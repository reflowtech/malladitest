import sys
import pandas as pd
from datetime import datetime
import requests

def download_csv(url, output_path):
    response = requests.get(url)
    with open(output_path, 'wb') as file:
        file.write(response.content)

def filter_csv_by_datetime(input_csv, output_csv, start_datetime, end_datetime):
    # Read the CSV file
    df = pd.read_csv(input_csv, sep=',')

    # Convert the 'Date&Time' column to datetime
    df['Date&Time'] = pd.to_datetime(df['Date&Time'], format='%d/%m/%y,%H:%M:%S')

    # Filter the DataFrame based on the start and end datetime
    mask = (df['Date&Time'] >= start_datetime) & (df['Date&Time'] <= end_datetime)
    filtered_df = df.loc[mask]

    # Write the filtered data to a new CSV file
    filtered_df.to_csv(output_csv, index=False)

if __name__ == "__main__":
    csv_url = 'https://malladi.s3.amazonaws.com/test.csv'
    input_csv = 'downloaded_test.csv'
    output_csv = 'filtered_output.csv'
    
    start_datetime_str = sys.argv[1]  # Start date and time in 'dd/mm/yy,HH:MM:SS' format
    end_datetime_str = sys.argv[2]  # End date and time in 'dd/mm/yy,HH:MM:SS' format

    # Convert start and end date-time strings to datetime objects
    start_datetime = datetime.strptime(start_datetime_str, '%d/%m/%y,%H:%M:%S')
    end_datetime = datetime.strptime(end_datetime_str, '%d/%m/%y,%H:%M:%S')

    # Download the CSV file
    download_csv(csv_url, input_csv)

    # Run the filter function
    filter_csv_by_datetime(input_csv, output_csv, start_datetime, end_datetime)

    print(f"Filtered data has been saved to {output_csv}")

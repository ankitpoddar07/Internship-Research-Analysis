import streamlit as st
import pandas as pd
import plotly.express as px
import os

# Page config
st.set_page_config(page_title="Filtered Sales Dashboard", layout="wide")
st.title("📊 Filtered Sales Dashboard")

# Try loading the CSV file
csv_path = "data/sales_data.csv"
if not os.path.exists(csv_path):
    st.error("❌ CSV file not found at 'data/sales_data.csv'. Please check the file path.")
    st.stop()

try:
    df = pd.read_csv(csv_path)

    if df.empty:
        st.warning("⚠️ CSV loaded but contains no data.")
        st.stop()

    st.success("✅ CSV loaded successfully")

    # Sidebar filters
    st.sidebar.header("🧰 Filter Options")
    region_options = df['region'].dropna().unique()

    if len(region_options) == 0:
        st.warning("⚠️ No regions available in the data.")
        st.stop()

    region = st.sidebar.selectbox("Choose Region", region_options)

    # Filter data
    filtered_df = df[df['region'] == region]

    # Show filtered table
    st.subheader(f"📍 Sales Data for Region: {region}")
    st.dataframe(filtered_df, use_container_width=True)

    # Plot: Total Sales by Product
    st.subheader("📦 Total Sales by Product")
    if not filtered_df.empty:
        fig = px.bar(
            filtered_df,
            x='product',
            y='total_sales',
            color='status',
            title=f"Sales Breakdown by Product in {region}"
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.warning("⚠️ No sales data available for this region.")

    # AI Insights
    try:
        from utils.insights import generate_insight
        st.subheader("🔍 AI Insight")
        st.info(generate_insight(filtered_df))
    except ImportError:
        st.warning("⚠️ Insight module not found in utils/insights.py")

except Exception as e:
    st.error(f"❌ Failed to load or process data: {e}")

import streamlit as st
import pandas as pd
import plotly.express as px
import os
import tempfile
from fpdf import FPDF
import plotly.io as pio

# Set up Streamlit page
st.set_page_config(page_title="Coffee Sales Analyzer", layout="wide")
st.title("☕ Coffee Sales Analyzer Dashboard")

# Load Excel file
file_path = "data/coffee_sales_full.xlsx"
if not os.path.exists(file_path):
    st.error("❌ Excel file not found.")
    st.stop()

df = pd.read_excel(file_path, sheet_name="Coffee Sales")
if df.empty:
    st.warning("⚠️ No data available in the Excel file.")
    st.stop()

st.success("✅ Data loaded successfully")
st.sidebar.header("📊 Filter Options")

# Sidebar Filters
store = st.sidebar.selectbox("Select Store Location", df["store_location"].unique())
category = st.sidebar.selectbox("Select Product Category", df["product_category"].unique())

# Filter data
filtered_df = df[(df["store_location"] == store) & (df["product_category"] == category)]

# Show data table
st.subheader(f"📍 Sales Data for {store} - {category}")
st.dataframe(filtered_df, use_container_width=True)

# Chart 1: Sales by Product
st.subheader("🔹 Total Sales by Product Detail")
sales_by_product = filtered_df.groupby("product_detail")["Total Bill"].sum().reset_index()
fig1 = px.bar(sales_by_product, x="product_detail", y="Total Bill", title="Total Sales per Product")
st.plotly_chart(fig1, use_container_width=True)

# Chart 2: Sales by Hour
st.subheader("⏰ Sales Distribution by Hour")
hourly_sales = filtered_df.groupby("Hour")["Total Bill"].sum().reset_index()
fig2 = px.line(hourly_sales, x="Hour", y="Total Bill", markers=True, title="Sales by Hour")
st.plotly_chart(fig2, use_container_width=True)

# Chart 3: Store Overview
st.subheader("🏪 Store Location Comparison")
location_sales = df.groupby("store_location")["Total Bill"].sum().reset_index()
fig3 = px.pie(location_sales, values="Total Bill", names="store_location", title="Sales Share by Store")
st.plotly_chart(fig3, use_container_width=True)

# AI Insight (optional)
try:
    from utils.insights import generate_insight
    st.subheader("📌 AI Insight")
    st.info(generate_insight(filtered_df))
except ImportError:
    st.warning("⚠️ Insight module not found")

# --- PDF Export Function ---
def generate_pdf(data, fig1, fig2, fig3, store, category):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Title
    pdf.cell(200, 10, txt=f"Coffee Sales Report: {store} - {category}", ln=True, align="C")
    pdf.ln(10)

    # Table Header
    for col in data.columns:
        pdf.cell(40, 10, str(col)[:15], border=1)
    pdf.ln()

    # Table Rows
    for _, row in data.iterrows():
        for item in row:
            pdf.cell(40, 10, str(item)[:15], border=1)
        pdf.ln()

    # Save plots as images
    tmp_dir = tempfile.mkdtemp()
    chart_paths = []

    for i, fig in enumerate([fig1, fig2, fig3]):
        chart_path = os.path.join(tmp_dir, f"chart_{i}.png")
        pio.write_image(fig, chart_path, format='png', width=900, height=500, scale=2)
        chart_paths.append(chart_path)

    # Add each chart to new page
    for chart in chart_paths:
        pdf.add_page()
        pdf.image(chart, x=10, y=30, w=180)  # Adjust size/position as needed

    # Save PDF
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf.output(temp_file.name)
    return temp_file.name

# PDF Export Button
if not filtered_df.empty:
    if st.button("⬇️ Download Report"):
        pdf_file_path = generate_pdf(filtered_df, fig1, fig2, fig3, store, category)
        with open(pdf_file_path, "rb") as f:
            st.download_button(
                label="📥 Download Full Report with Charts (PDF)",
                data=f,
                file_name=f"{store}_{category}_Sales_Report.pdf",
                mime="application/pdf"
            )
        st.success("✅ PDF report generated successfully!")
else:
    st.warning("⚠️ No data available for PDF report generation.")
# End of app.py
import assets from "../assets"

export const API_URL = "http://192.168.100.71:5000"

export const QuickActions = [
  {
    title: "📋 Today's Leads",
    description: "How much production did we generate today as a company?",
  },
  {
    title: "🏆 Top Leads",
    description: "When was the latest oil pick up?",
  },
  {
    title: "🆕 New Leads",
    description: "What are our least performing wells?",
  },
  {
    title: "🚀 NrgOps AI",
    description: "What is our expected revenue this month?",
  },
]

export const integrations = [
  {
    id: "pdf",
    name: "PDF",
    img: assets.PDFIcon,
  },
  {
    id: "gdoc",
    name: "Google Doc",
    img: assets.DOCIcon,
  },
  {
    id: "gsheet",
    name: "Google Sheet",
    img: assets.SHEETIcon,
  },
]

export const override = {
  borderColor: "#4f46e5",
  zIndex: 31,
}
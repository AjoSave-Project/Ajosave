const METRICS_DATA = [
  { value: "6+", label: "Months in Development" },
  { value: "100%", label: "Transparent Ledger" },
  { value: "24/7", label: "Support Available" },
  { value: "Beta", label: "Open Now" }
]

const MetricsSection = () => {
  return (
    <div className="bg-blue-500 text-white mt-20 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-deepBlue-300 text-xs font-bold uppercase tracking-widest mb-10">Built carefully. Released honestly.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {METRICS_DATA.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="text-3xl font-extrabold">{metric.value}</div>
              <div className="text-xs text-deepBlue-200 uppercase tracking-wider font-semibold">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MetricsSection

project_name: "viz-gauge_next-marketplace"

constant: VIS_LABEL {
  value: "Gauge Next"
  export: override_optional
}

constant: VIS_ID {
  value: "gauge_next-marketplace"
  export:  override_optional
}

visualization: {
  id: "@{VIS_ID}"
  file: "gauge.js"
  label: "@{VIS_LABEL}"
  dependencies: ["https://code.jquery.com/jquery-2.2.4.min.js","https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js","https://d3js.org/d3.v5.min.js"]
}

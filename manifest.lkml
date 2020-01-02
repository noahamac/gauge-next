project_name: "viz-gauge_next-marketplace"

constant: GAUGE_NEXT {
  value: "Gauge Next"
  export: override_optional
}

constant: GAUGE_NEXT_ID {
  value: "gauge_next-marketplace"
  export:  override_optional
}

constant: CHILI_GAUGE {
  value: "Chili Gauge"
  export: override_optional
}

constant: CHILI_GAUGE_ID {
  value: "chili_gauge-marketplace"
  export:  override_optional
}

visualization: {
  id: "@{GAUGE_NEXT}"
  file: "gauge.js"
  label: "@{GAUGE_NEXT_ID}"
  dependencies: ["https://code.jquery.com/jquery-2.2.4.min.js","https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js","https://d3js.org/d3.v5.min.js"]
}

visualization: {
  id: "@{CHILI_GAUGE}"
  file: "chili-gauge.js"
  label: "@{CHILI_GAUGE_ID}"
  dependencies: ["https://code.jquery.com/jquery-2.2.4.min.js","https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js","https://d3js.org/d3.v5.min.js"]
}

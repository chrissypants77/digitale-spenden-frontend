interface Config {
    icon: string | string[]
    color: string
}

const config: Config[] = [
    { icon: "i-lucide-crown", color: "#facc15" }, // yellow-400
    { icon: "i-carbon-number-2", color: "#38bdf8" }, // sky-400
    { icon: "i-carbon-number-3", color: "#4ade80" }, // green-400
    { icon: "i-carbon-number-4", color: "#a78bfa" }, // violet-400
    { icon: "i-carbon-number-5", color: "#fb923c" }, // orange-400
    { icon: "i-carbon-number-6", color: "#fb7185" }, // rose-400
    { icon: "i-carbon-number-7", color: "#22d3ee" }, // cyan-400
    { icon: "i-carbon-number-8", color: "#818cf8" }, // indigo-400
    { icon: "i-carbon-number-9", color: "#f472b6" }, // pink-400
    { icon: ["i-carbon-number-1", "i-carbon-number-0"], color: "#fbbf24" } // amber-400
]

export default config
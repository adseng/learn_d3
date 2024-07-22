import { useEffect } from "react";
import * as d3 from "d3";

function App() {
  useEffect(() => {
    linePlot();
  }, []);

  async function linePlot() {
    // Declare the chart dimensions and margins.
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    const parseDate = d3.timeParse("%Y-%m-%d"); // 假设日期格式是"YYYY-MM-DD"
    // 数据 正常化 格式化 或者 数据 清洗
    const aapl = (await d3.csv("aapl.csv")).map((d) => {
      return {
        // date: new Date(d.date),
        date: parseDate(d.date),
        close: +d.close,
      };
    });

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc(
      d3.extent(aapl, (d) => d.date),
      [marginLeft, width - marginRight]
    );

    console.log(d3.extent(aapl, (d) => d.date));

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear([0, d3.max(aapl, (d) => d.close)], [height - marginBottom, marginTop]);

    // Declare the line generator.
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.close));

    // Create the SVG container.
    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "height: 100%; height: 100%;");

    // Add the x-axis.
    svg
      .append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Daily close ($)")
      );

    // Append a path for the line.
    svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line(aapl));

    document.querySelector(".svgBox")?.appendChild(svg.node());

    return svg.node();
  }

  return (
    <>
      <div className="svgBox w-[400px] h-[500px]"></div>
    </>
  );
}

export default App;

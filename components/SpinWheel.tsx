
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { STUDENT_LIST, COLORS } from '../constants';

interface SpinWheelProps {
  isSpinning: boolean;
  onSpinEnd: (student: string) => void;
  onSpinStart: () => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ isSpinning, onSpinEnd, onSpinStart }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);

  // Initialize the wheel once
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 450;
    const height = 450;
    const radius = Math.min(width, height) / 2 - 10;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie<string>().value(1).sort(null);
    const data = pie(STUDENT_LIST);

    const arc = d3.arc<d3.PieArcDatum<string>>()
      .innerRadius(0)
      .outerRadius(radius);

    const labelArc = d3.arc<d3.PieArcDatum<string>>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.92);

    const slices = svg.selectAll('g.slice')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'slice');

    slices.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => COLORS[i % COLORS.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', '2px');

    slices.append('text')
      .attr('transform', (d) => {
        const [x, y] = labelArc.centroid(d);
        const angle = (d.startAngle + d.endAngle) / 2;
        // Rotate text to follow the radius
        const rotate = (angle * 180 / Math.PI);
        return `translate(${x}, ${y}) rotate(${rotate - 90})`;
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .attr('fill', '#000') // Black text for better contrast
      .style('font-size', '11px') // Slightly larger
      .style('font-weight', '900') // Extra bold
      .style('pointer-events', 'none')
      .text((d) => d.data.split(' ').pop() || ''); // Last name only

    // Center decoration
    svg.append('circle')
      .attr('r', 20)
      .attr('fill', '#fff')
      .attr('stroke', '#333')
      .attr('stroke-width', 3);
      
    svg.append('circle')
      .attr('r', 8)
      .attr('fill', '#333');

  }, []);

  // Handle spinning logic when isSpinning prop changes
  useEffect(() => {
    if (isSpinning) {
      const extraDegrees = Math.floor(Math.random() * 360) + 1800; // 5 full spins min
      const newRotation = rotationRef.current + extraDegrees;
      rotationRef.current = newRotation;
      setRotation(newRotation);

      const timer = setTimeout(() => {
        const actualRotation = newRotation % 360;
        const sliceAngle = 360 / STUDENT_LIST.length;
        
        // The arrow is at the top (270 degrees in SVG coordinates if 0 is at 3 o'clock)
        // Since we rotate the container clockwise, we calculate the index relative to the pointer
        // formula: index = (PointerAngle - actualRotation) / sliceAngle
        // Pointer is at -90deg (or 270deg)
        const pointerAngle = 270;
        const index = Math.floor(((pointerAngle - actualRotation + 3600) % 360) / sliceAngle);
        const selectedStudent = STUDENT_LIST[index % STUDENT_LIST.length];
        
        onSpinEnd(selectedStudent);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isSpinning, onSpinEnd]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 relative p-4 bg-white rounded-full shadow-2xl border-8 border-yellow-400">
      <div 
        className="relative transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0,0.15,1)]"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg ref={svgRef} className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]"></svg>
      </div>
      {/* Pointer (Static, outside rotation div) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-red-600 z-20 drop-shadow-xl filter">
         <div className="absolute top-[-45px] left-[-5px] w-[10px] h-[10px] bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default SpinWheel;

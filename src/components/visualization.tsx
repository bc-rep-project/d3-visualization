import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useParams } from 'react-router-dom';

interface INode {
  id: string;
  group: number;
  size: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

interface ILink {
  source: INode;
  target: INode;
}

interface IParams {
  [key: string]: string;
  owner: string;
  repoName: string;
}

const Visualization: React.FC = () => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [links, setLinks] = useState<ILink[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const { owner, repoName } = useParams<IParams>();

  const fetchNodesData = async (): Promise<INode[]> => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/nodes');
    const data = await response.json();
    return data;
  }

  const fetchLinksData = async (): Promise<ILink[]> => {
    // Replace with your actual API endpoint
    const response = await fetch('/api/links');
    const data = await response.json();
    
    // Map source and target IDs to node objects
    return data.map((link: any) => ({
      source: nodes.find(node => node.id === link.source),
      target: nodes.find(node => node.id === link.target),
    }));
  }

  const fetchData = async () => {
    const nodesData: INode[] = await fetchNodesData();
    const linksData: ILink[] = await fetchLinksData();

    setNodes(nodesData);
    setLinks(linksData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (svgRef.current) {
      // Set up the D3.js force layout
      const svg = d3.select(svgRef.current);

      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide())
        .force('link', d3.forceLink(links));

        const ticked = () => {
        const u = d3.select<SVGCircleElement, INode>('svg')
            .selectAll<SVGCircleElement, INode>('circle')
            .data(nodes);
        
          u.enter()
            .append('circle')
            .attr('r', 5)
            .merge(u)
            .attr('cx', function(d) {
              return d.x || 0;
            })
            .attr('cy', function(d) {
              return d.y || 0;
            });
        
          u.exit().remove();
        
          const v = d3.select<SVGLineElement, ILink>('svg')
            .selectAll<SVGLineElement, ILink>('line')
            .data(links);
        
          v.enter()
            .append('line')
            .merge(v)
            .attr('x1', function(d) {
              return d.source.x || 0;
            })
            .attr('y1', function(d) {
              return d.source.y || 0;
            })
            .attr('x2', function(d) {
              return d.target.x || 0;
            })
            .attr('y2', function(d) {
              return d.target.y || 0;
            });
        
          v.exit().remove();
        };

      simulation.on('tick', ticked);
    }
  }, [nodes, links]);

  return (
    <div>
      <svg ref={svgRef} style={{border: '1px solid black', height: '500px'}} />
    </div>
  );
};

export default Visualization;
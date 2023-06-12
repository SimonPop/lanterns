Title: The Onion Graph
Date: 2023-06-11
Category: Graph Theory
Tags: graph-robustness, theory
Author: Simon Popelier
Summary: What makes the Onion graph a special type of networks.
JS: onion_d3.js (bottom) 

# Introduction



<div id="my_dataviz"></div>

# Robustness

Robustness for networks is often measured in terms of how difficult it is to split the graph appart when successively removing nodes. This comes from the [Percolation Theory](https://en.wikipedia.org/wiki/Percolation_theory) study and designates a network as robust if most of its nodes remain accessible to each other in case of successive failures.

In “most” of its nodes we have to understand, the nodes part of the main component: the biggest group still  connected.

## Scale-Free Networks

Onion networks are scale-free. They should therefore be compared to other scale-free networks.

> “*Scale-free networks are networks whose degree distribution follows a power law*.”  - [Wikipedia](https://en.wikipedia.org/wiki/Scale-free_network) - Meaning they have few high degree nodes, and exponentially more lower degree nodes.

For these categories of networks, a good property to have for being robust is *degree assertativity*: nodes like to be connected to same degree nodes.

Although not all degree assertative graphs are onions, all onions are degree assertative. 

## Intuition

The reason behind the robustness of degree assertative graph can be intuitively seen by taking two opposite examples: 

1. An onion graph: degree assertative.
2. A decreasingly branching tree: not degree assertative.

<Figure: Tree vs Onion>

An attack, if selective, will likely target one of the higher degree nodes.

Removing such a node in the Tree instantly cuts the entire branch out of the main component. This is because of the hierarchical exclusivity that linked lower level nodes to this single node in order to reach the root of the tree (and come back down to communicate to any other node).

<Figure: Tree with missing nodes>

Removing such a node in the Onion does nothing like that. There is no hierarchical exclusivity: lower level nodes that used to be linked to the removed node can still connect to the core of the onion through pairs of the same layer still connected to the core, and accessible to them (thanks to assertativity).

<Figure: Onion with missing nodes>

We can thus conclude that onions definitively have nothing to do with trees.

## Experiment

This intuition can be backed by experimenting on attacks, comparing the performance of onion graphs and random other scale-free graphs.

# Generation

# Conclusion

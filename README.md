# Cornhub Subgraph

## Overview

Contract addresses and startBlocks are defined in `config/<network>.json`

Subgraph data sources (contract definitions and event handlers) are defined in `subgraph.template.yaml`

*`subgraph.yaml` is gitignored and should not be edited.*

## Getting started

```bash
yarn install

yarn global add @graphprotocol/graph-cli
```

## Config

`config/*.json` files define addresses and start blocks for contracts on specific networks. Usually, a contract's start block should be the block where that contract was deployed.

## Generating subgraph.yaml

Subgraphs are defined by a `subgraph.yaml` file, which is generated from `*.template.yaml` files. To make it easier to support multiple contract versions, there is a template file for each version as well as "shared".

Running `yarn prep <network>` will run `scripts/prepare.js` to construct a `subgraph.yaml` file for that network, using yaml template files and the contracts defined in `config/<network>.json`. 

The `prepare.js` script also performs a safety check for mismatches between the generated `subgraph.yaml` and the mapping files. Warnings will be shown if:
- a function is referenced in the `subgraph.yaml` that isn't defined in any mapping files
- a function defined in a mapping file isn't referenced in the `subgraph.yaml`

## Deploying

To deploy a new subgraph version, first prepare the subgraph for the intended network:

```bash
yarn prep <network-name> # bsc
```

- Generates TS types for the schema defined in `schema.graphql`
- Compiles new gitignored `subgraph.yaml`

First you will need to authenticate with the proper deploy key for the given network (you'll only need to do this once).

```bash
graph auth --studio ${your-key}
```
Once authenticated:

```bash
graph deploy --studio <subgraph-name>
```

> Note: previous subgraph versions will be automatically archived when new versions are deployed, and must be manually unarchived if needed.

To check health of a deployed subgraph: 

```
curl -X POST -d '{ "query": "{indexingStatuses(subgraphs: [\"<deployment-id>\"]) {synced health fatalError {message block { number } handler } subgraph chains { chainHeadBlock { number } latestBlock { number }}}}"}' https://api.thegraph.com/index-node/graphql
```

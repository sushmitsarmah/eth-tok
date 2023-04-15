GRAPH_API_KEY="05f3cca40ee7f9f57c8bc818eced5b8b"

graph init \
  --product subgraph-studio
  --from-contract $(GRAPH_API_KEY) \
  --network https://rpc.public.zkevm-test.net \
  --abi artifacts/contracts/Tournament.sol/Tournament.json \
  tournament graph
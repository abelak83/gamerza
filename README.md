# Dispatcher RZA (RZA Dispatcher)

Prototype learning game UI for relay protection & automation training.

## Run locally
Use a static server to avoid browser restrictions for JSON loading:

```bash
python3 -m http.server --directory src 8000
```

Then open <http://localhost:8000>.

## Data-driven content
Mission, module, and glossary content is stored in `data/*.json` and rendered on the client.

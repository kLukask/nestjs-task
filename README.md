How to use:

### 1. Start the app
```bash
docker-compose up --build
```

### 2. Populate mock data
`http://localhost:3000/data/seed`

### 3. Test with browser
- (no table name provided, let rule to decide automatically)
`http://localhost:3000/data/point?ticker=AAPL&datapoint=revenue`
`http://localhost:3000/data/point?ticker=AAPL&datapoint=price_change_percent`
- (provide table name)
`http://localhost:3000/data/point?ticker=AAPL&datapoint=revenue&tablename=financial_data`
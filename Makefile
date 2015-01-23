test:
	@./node_modules/.bin/mocha tests -u tdd --reporter spec
.PHONY: test
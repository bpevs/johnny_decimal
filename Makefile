start:
	deno run --allow-read --allow-env --allow-run source/cli.ts

install:
	deno install --allow-read --allow-env --allow-run --name=johnny_decimal source/cli.ts

uninstall:
	deno uninstall johnny_decimal

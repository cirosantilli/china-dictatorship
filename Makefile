README.html: README.adoc
	asciidoctor -o '$@' -v '$<'

README.html: README.adoc
	bundle exec asciidoctor -o '$@' -v '$<'

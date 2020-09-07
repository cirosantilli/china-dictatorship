.PHONY: clean

OUT = README.html
HEAD = head.html
BODY = README.body.html
FOOT = foot.html

$(OUT): README.adoc $(HEAD) $(FOOT)
	bundle exec asciidoctor \
	  --embedded \
	  --failure-level info \
	  -o $(BODY) \
	  -v \
	  '$<'
	cat $(HEAD) $(BODY) $(FOOT) > '$@'

clean:
	rm -rf $(OUT) $(BODY)

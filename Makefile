.PHONY: clean

OUT = README.html
HEAD = head.html
BODY = README.body.html
FOOT = foot.html
MEDIA =

ifeq ($(MEDIA),)
	MEDIA_CMD =
else
	MEDIA_CMD = -a china-dictatorship-media-base='$(MEDIA)'
endif

$(OUT): README.adoc $(HEAD) $(FOOT) template_dir/*
	bundle exec asciidoctor \
		$(MEDIA_CMD) \
	  --embedded \
	  --failure-level info \
	  -o $(BODY) \
		--template-dir template_dir \
		--trace \
	  -v \
	  '$<'
	cat $(HEAD) $(BODY) $(FOOT) > '$@'

clean:
	rm -rf $(OUT) $(BODY)

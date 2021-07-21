.PHONY: clean

OUT = README.html
HEAD = head.html
BODY = body.html
FOOT = foot.html
MEDIA =

ifeq ($(MEDIA),)
	MEDIA_CMD =
else
	MEDIA_CMD = -a china-dictatorship-media-base='$(MEDIA)'
endif

$(OUT): README.adoc $(HEAD) $(FOOT) template_dir/*
	@# --embedded + head/foot originally added to fix image height:
	@# https://stackoverflow.com/questions/63464732/how-to-set-a-custom-image-height-for-an-image-in-asciidoctor
	@#
	@# --template-dir initially added for loading="lazy" on images and youtube iframes:
	@# https://stackoverflow.com/questions/63917971/how-to-create-custom-html-output-for-an-existing-asciidoctor-asciidoc-macro
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

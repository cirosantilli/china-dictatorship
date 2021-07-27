.PHONY: clean multipage

IN = README.adoc
OPTS = \
	--failure-level info \
	--trace \
	-v
OUT = README.html
OUT_DIR = out
OUT_MULTIPAGE_DIR = $(OUT_DIR)/multipage
OUT_MULTIPAGE = $(OUT_MULTIPAGE_DIR)/README.html
HEAD = head.html
BODY = body.html
FOOT = foot.html
MEDIA =

ifeq ($(MEDIA),)
	MEDIA_CMD =
else
	MEDIA_CMD = -a china-dictatorship-media-base='$(MEDIA)'
endif

$(OUT): $(IN) $(HEAD) $(FOOT) template_dir/*
	@# --embedded + head/foot originally added to fix image height:
	@# https://stackoverflow.com/questions/63464732/how-to-set-a-custom-image-height-for-an-image-in-asciidoctor
	@#
	@# --template-dir initially added for loading="lazy" on images and youtube iframes:
	@# https://stackoverflow.com/questions/63917971/how-to-create-custom-html-output-for-an-existing-asciidoctor-asciidoc-macro
	@#
	@# --template-dir not in opts due to:
	@# https://github.com/owenh000/asciidoctor-multipage/issues/19
	@# It is not however very important in multipage output.
	bundle exec asciidoctor \
		$(MEDIA_CMD) \
	  --embedded \
	  -o $(BODY) \
		--template-dir template_dir \
	  $(OPTS) \
	  '$<'
	cat $(HEAD) $(BODY) $(FOOT) > '$@'

multipage: $(OUT_MULTIPAGE)

$(OUT_MULTIPAGE): $(IN) template_dir/*
	bundle exec asciidoctor \
		-D '$(OUT_MULTIPAGE_DIR)' \
		-a multipage-level=6 \
		-b multipage_html5 \
		-r asciidoctor-multipage \
	  $(OPTS) \
	  '$<'

clean:
	rm -rf $(OUT) $(BODY)

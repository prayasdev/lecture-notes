# Validation Notes

The catalogue, subject detail view, Digital module directory, and Legacy tab were verified in the live development preview on 19 August 2026. The sample legacy PDF is discovered correctly by the distributed-manifest synchronizer and appears in the Legacy tab. Repository paths contain a space in `digital notes`, so the synchronizer uses GitHub’s repository raw-file route (`github.com/<owner>/<repository>/raw/refs/heads/<branch>/...`) rather than the raw host directly; this route was verified to download the sample PDF successfully.

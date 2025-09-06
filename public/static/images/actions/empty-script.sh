for f in *.png; do
  mv -- "$f" "${f%.png}-full.png"
done
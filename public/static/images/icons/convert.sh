for file in *-full.png; do
  echo "Converting $file"
  convert "$file" -resize 100x100 "${file%-full.png}.png"
  # Aquí puedes agregar el código que desees ejecutar para cada archivo
done


rm -f ../siteSelection-release/dist/*
npm run build
cp -R dist fuck
cp index.html fucker.html
mv fuck/* ../siteSelection-release/dist/
mv fucker.html ../siteSelection-release/index.html
rm -rf fuck

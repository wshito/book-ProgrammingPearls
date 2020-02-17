# コラム１．整数のソート

## 問題

- 7桁の重複のない整数値データを少ないメモリ（1MB）でソートしたい．
- 10^7 > 整数値 >= 10^6
- 7桁を表すには 24bit=3byte あれば十分．3byte x 10^7個 = 30MB必要！ 8byte intの場合80MB！
- 典型的な解決法はデータの一部を外部記憶装置に書き出しながらマージして行く [External sorting](https://en.wikipedia.org/wiki/External_sorting)．
- 例えば [k-way merge algorithm](https://en.wikipedia.org/wiki/K-way_merge_algorithm) などが考えられる．

## 解決策

- 10^7 = 1千万個のビット列を用意し，データ内に数値が有ればその値のindexのビットを立てる．ビット列をindex 0から順にアクセスしながらビットが立っている値を書き出すとソートされた整数を得る．
- 10^7bit / 8bit = 1,250,000byte = 1.25MB あれば解結できる．
- 1MBしかない場合の解決策は章末問題5で考える．

## 実装ノート

- JavaScript実装は [`js`](js/) ディレクトリ以下．
  - JavaScriptの配列は実際にはオブジェクトのリストになるため，`uint8array`
  - 7桁の電話番号100万件のデータは [`src/7digits.txt`](js/src/7digits.txt)．このデータの生成スクリプトは [`src/GenerateData.js`](js/src/GenerateData.js) で定義．  
    実行方法: `node src/GenerateData.js > src/7digits.txt`

## 問題3

メモリに制約があるという前提なので，データの読み込みはストリームを使い部分的に読み込みながら処理していく．

**JavaScript実装（以下 `js` ディレクトリ以下）**

- [`src/SortWithBitArray.js`](js/src/SortWithBitArray.js)  
  ビット配列を使ったバージョン．実行すると `src/7digits-sorted.txt` ファイルにソート結果を書き出し，コンソールに使用メモリを表示する．  
  実行方法: `cd src && node SortWithBitArray.js`
- [`src/SortWithArray.js`](js/src/SortWithArray.js)  
  問題3のビット配列を使う代わりに通常の配列にtrue/falseを格納してソートするレファレンス実装．配列のサイズ分だけ若干使用メモリが増える．ソート結果は `src/7digits-sorted2.txt` に書き出す．  
  実行方法: `cd src && node SortWithArray.js`

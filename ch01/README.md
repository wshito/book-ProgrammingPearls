# コラム１．整数のソート

## 問題

- 7桁の重複のない整数値データを少ないメモリ（1MB）でソートしたい．
- 10^7 > 整数値 >= 10^6
- 7桁を表すには 24bit=3byte あれば十分．3byte x 10^7個 = 30MB必要！ 8byte intの場合80MB！
- 典型的な解決法はデータの一部を外部記憶装置に書き出しながらマージして行く [External sorting](https://en.wikipedia.org/wiki/External_sorting)．
- 例えば [k-way merge algorithm](https://en.wikipedia.org/wiki/K-way_merge_algorithm) などが考えられる．

## 解決策

- 10^7 = 1千万個のビット列を用意し，データ内に数値が有ればその値のindexのビットを立てる．ビット列をindex 0から順にアクセスしながらビットが立っているインデックス値を書き出すとソートされた整数を得る．
- 10^7bit / 8bit = 1,250,000byte = 1.25MB あれば解結できる．
- 1MBしかない場合の解決策は問題5で考える．

## 実装ノート

- JavaScript実装は [`js`](js/) ディレクトリ以下．
  - JavaScriptの配列は実際にはオブジェクトのリストになるため，`uint8array`
  - 7桁の電話番号100万件のデータは [`src/7digits.txt`](js/src/7digits.txt)．このデータの生成スクリプトは [`src/GenerateData.js`](js/src/GenerateData.js) で定義．  
    実行方法: `node src/GenerateData.js > src/7digits.txt`

## 問題1

**JavaScript実装（以下 `js` ディレクトリ以下）**

メモリが沢山あるという前提だが，ファイル内の電話番号は1行ずつパースしないといけないので，ストリームを使って1行ずつ読み込みながら配列に格納する．実装は [`src/SortWithLibrary.js`](js/src/SortWithLibrary.js)．ソート結果は `src/7digits-lib-sorted.txt` に書き出す．

実行方法: `cd src && node SortWithLibrary.js`

## 問題2

- JavaScriptの実装は問題3のビット配列を使った実装 [`src/SortWithBitArray.js`](js/src/SortWithBitArray.js) を参照．

## 問題3

メモリに制約があるという前提なので，データの読み込みはストリームを使い部分的に読み込みながら処理していく．

**JavaScript実装（以下 `js` ディレクトリ以下）**

- [`src/SortWithBitArray.js`](js/src/SortWithBitArray.js)  
  ビット配列を使ったバージョン．実行すると `src/7digits-sorted.txt` ファイルにソート結果を書き出し，コンソールに使用メモリを表示する．  
  実行方法: `cd src && node SortWithBitArray.js`
- [`src/SortWithArray.js`](js/src/SortWithArray.js)  
  問題3のビット配列を使う代わりに通常の配列にtrue/falseを格納してソートするレファレンス実装．配列のサイズ分だけ若干使用メモリが増える．ソート結果は `src/7digits-sorted2.txt` に書き出す．  
  実行方法: `cd src && node SortWithArray.js`

## 問題4

**JavaScript実装（以下 `js` ディレクトリ以下）**

[`src/GenerateData.js`](js/src/GenerateData.js) で実装．実行方法は `cd src && node GenerateData.js > 7digits.txt`．ちなみに実行済みデータファイルがGitリポジトリに登録されている．

模範解答の実装と比べてどちらが速いかは計測が必要．模範解答では10^7個のデータを生成したあと，頭から10^6個の配列のみスワップすることでシャッフルしている．ただし，スワップ先は10^7個までを対象としている．`GenerateData.js` では10^7個をシャッフルして10^6個を取り出している．

模範解答の方法で実装するならば，[0, 10^7] の整数値を返す `randint` は `Math.random() * (10 ** 7) | 0` で実装できる．

## 問題5

10^7個のビット配列は 10^7bit / 8bit = 1,250,000byte = 1.25MB 必要．この半分のビット配列を使うことで約0.625MBメモリ使用量を減らせる．ソートに使うビット配列が半分になるので2パスでソートする．

まず1回目のデータファイルの走査で(10^7)/2未満の値のみに限定してビット配列に格納し，結果をファイルに書き出す．2回目の操作で(10^7)/2以上の値をビット配列に格納し，インデックスの値に(10^7)/2のオフセット値を加えて，出力ファイルにアペンドする．

- JavaScriptの実装: [`js/src/TwoPassSort.js`](js/src/TwoPassSort.js)  
  実行方法は `cd js/src && node TwoPassSort.js`  
  出力ファイルは `7digits-2pass-sorted.txt`


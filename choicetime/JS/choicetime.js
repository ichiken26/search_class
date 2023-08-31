document.addEventListener("DOMContentLoaded", function() {
    const classTimesList = document.getElementById("class-times-list");

    // CSVのヘッダー行から時間帯データを取得
    
    // CSVファイルのパス
    const csvFilePath = "https://ichiken26.github.io/search_class/media/classes.csv";

    // CSVファイルの読み込みとヘッダー行の取得
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvText => {
            const lines = csvText.split("\n");
            const headerLine = lines[0];

            // ヘッダー行から時間帯データを取得
            const classTimes = headerLine.split(",").slice(6); // 番目以降の要素を取得

            // 取得した時間帯データをリストアイテムとして表示
            classTimes.forEach(time => {
                const listItem = document.createElement("li");
                listItem.textContent = time;
                classTimesList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("CSVファイルの読み込みエラー: ", error);
        });

    // 時間帯リストのクリックイベント
    classTimesList.addEventListener("click", function(event) {
        const clickedclassTimes = event.target.textContent;
        if (clickedclassTimes) {
            // 次のページに遷移
            // ここで選択された時間帯の学部リストを渡すなどの処理を行う
            window.location.href = `https://ichiken26.github.io/search_class/choicetime/faculties?&classTimes=${clickedclassTimes} `;
        }
    });
});



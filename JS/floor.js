document.addEventListener("DOMContentLoaded", async function() {
    const buildingNameElement = document.getElementById("building-name");
    const floorList = document.getElementById("floor-list");

    // URLから選択された学部と棟を取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedFaculty = urlParams.get("faculty");
    const selectedBuilding = urlParams.get("building");

    // 学部と棟の情報を表示
    buildingNameElement.textContent = `${selectedFaculty}/${selectedBuilding}棟`;

    // CSVファイルのURL
    const classesCSV = "https://ichiken26.github.io/search_class/media/classes.csv";

    // CSVファイルから階層情報を読み込む関数
    async function fetchFloors() {
        const response = await fetch(classesCSV);
        const text = await response.text();
        const lines = text.split("\n");
        const floors = new Set();

        // CSVの階層列から階層情報を抽出
        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const columns = lines[i].split(",");
            if (columns.length >= 4 && columns[0] === selectedFaculty && columns[1] === selectedBuilding) {
                floors.add(columns[2]);
            }
        }

        return Array.from(floors);
    }

    // 階層情報を表示
    const floors = await fetchFloors();
    floors.forEach(floor => {
        const listItem = document.createElement("li");
        listItem.textContent = floor;
        floorList.appendChild(listItem);
    });

    // 階層リストのクリックイベント
    floorList.addEventListener("click", function(event) {
        const clickedFloor = event.target.textContent;
        if (clickedFloor) {
            // 次のページに遷移（class.htmlなど）
            // ここで選択された学部・棟・階層を渡すなどの処理を行う
            window.location.href = `class?faculty=${selectedFaculty}&building=${selectedBuilding}&floor=${clickedFloor}`;
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // 本番環境のトップページURL
    const productionTopPageURL = "https://ichiken26.github.io/search_class";

    // ログインページにアクセスしているかチェック
    if (window.location.href.endsWith("/login.html")) {
        // ここにログイン処理のコードを記述します
        // 例: ログインが成功した場合、トップページに遷移
        // 例: ログインが失敗した場合は何もしない
    } else if (window.location.href !== productionTopPageURL) {
        // ログイン処理後、トップページ以外にアクセスしている場合、本番環境のトップページにリダイレクト
        window.location.href = productionTopPageURL;
    }
});

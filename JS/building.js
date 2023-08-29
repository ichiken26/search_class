document.addEventListener("DOMContentLoaded", async function() {
    const facultyNameElement = document.getElementById("faculty-name");
    const buildingList = document.getElementById("building-list");

    // URLから選択された学部を取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedFaculty = urlParams.get("faculty");

    // 学部名を表示
    facultyNameElement.textContent = selectedFaculty;

    // CSVファイルのURL
    const classesCSV = "https://ichiken26.github.io/search_class/media/classes.csv";

    // CSVファイルから棟情報を読み込む関数
    async function fetchBuildings() {
        const response = await fetch(classesCSV);
        const text = await response.text();
        const lines = text.split("\n");
        const buildings = new Set();

        // CSVの棟列から棟情報を抽出
        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const columns = lines[i].split(",");
            if (columns.length >= 4 && columns[0] === selectedFaculty) {
                buildings.add(columns[1]);
            }
        }

        return Array.from(buildings);
    }

    // 棟情報を表示
    const buildings = await fetchBuildings();
    buildings.forEach(building => {
        const listItem = document.createElement("li");
        listItem.textContent = building;
        buildingList.appendChild(listItem);
    });

    // 棟リストのクリックイベント
    buildingList.addEventListener("click", function(event) {
        const clickedBuilding = event.target.textContent;
        if (clickedBuilding) {
            // 次のページに遷移（floor.htmlなど）
            // ここで選択された学部と棟を渡すなどの処理を行う
            window.location.href = `https://ichiken26.github.io/search_class/floor?faculty=${selectedFaculty}&building=${clickedBuilding}`;
        }
    });
});

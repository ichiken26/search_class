document.addEventListener("DOMContentLoaded", async function() {
    const classInfoElement = document.getElementById("class-info");
    const timetableTable = document.getElementById("timetable");

    // URLから選択された学部・棟・階層・教室名を取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedFaculty = urlParams.get("faculty");
    const selectedBuilding = urlParams.get("building");
    const selectedFloor = urlParams.get("floor");
    const selectedClass = urlParams.get("class");

    // 教室情報を表示
    classInfoElement.textContent = `${selectedFaculty}/${selectedBuilding}棟/${selectedFloor}F/${selectedClass}`;

    // CSVファイルのURL
    const classesCSV = "https://ichiken26.github.io/search_class/media/classes.csv";

    // CSVファイルから教室情報を読み込む関数
    async function fetchClassData() {
        const response = await fetch(classesCSV);
        const text = await response.text();
        const lines = text.split("\n");
        let classInfo = null;

        // CSVの各行から教室情報を抽出
        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const columns = lines[i].split(",");
            if (columns.length >= 12 && columns[0] === selectedFaculty && columns[1] === selectedBuilding && columns[2] === selectedFloor && columns[3] === selectedClass) {
                classInfo = {
                    periods: columns.slice(6)
                };
                break;
            }
        }

        return classInfo;
    }

    // 教室情報を取得し、時刻表を生成
    const classInfo = await fetchClassData();
    generateTimetable(classInfo);
});

function generateTimetable(classInfo) {
    const timetableTable = document.getElementById("timetable");

    // 時刻表のヘッダー行を生成
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.textContent = "時間帯";
    headerRow.appendChild(headerCell);
    timetableTable.appendChild(headerRow);

    // 各時間帯に対して行を生成
    classInfo.periods.forEach((period, index) => {
        const row = document.createElement("tr");

        // 時間帯を表示するセルを追加
        const periodCell = document.createElement("td");
        const timetable = ["1限", "2限", "3限", "4限", "5限", "6限"];
        periodCell.textContent = timetable[index];
        row.appendChild(periodCell);

        // 利用可否を表示するセルを追加
        const availabilityCell = document.createElement("td");
        if (period === "0") {
            availabilityCell.classList.add("o-mark");
            availabilityCell.textContent = "〇";
        } else if (period === "1") {
            availabilityCell.classList.add("x-mark");
            availabilityCell.textContent = "✕";
        }
        row.appendChild(availabilityCell);

        timetableTable.appendChild(row);
    });
}

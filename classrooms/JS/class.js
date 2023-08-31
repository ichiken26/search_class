document.addEventListener("DOMContentLoaded", async function() {
    const floorInfoElement = document.getElementById("floor-info");
    const classGrid = document.getElementById("class-grid");

    // URLから選択された学部・棟・階層を取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedFaculty = urlParams.get("faculty");
    const selectedBuilding = urlParams.get("building");
    const selectedFloor = urlParams.get("floor");

    // 階層情報を表示
    floorInfoElement.textContent = `${selectedFaculty}/${selectedBuilding}棟/${selectedFloor}F`;

    // CSVファイルのURL
    const classesCSV = "https://ichiken26.github.io/search_class/media/classes.csv";
    const timetableCSV = "https://ichiken26.github.io/search_class/media/timetable.csv";

    // 現在時刻を取得（hhmm形式の数値として）
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 100 + currentMinute;

    // CSVファイルから教室情報を読み込む関数
    async function fetchClassData() {
        const response = await fetch(classesCSV);
        const text = await response.text();
        const lines = text.split("\n");
        const classData = [];

        // CSVの各行から教室情報を抽出
        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const columns = lines[i].split(",");
            if (columns.length >= 12 && columns[0] === selectedFaculty && columns[1] === selectedBuilding && columns[2] === selectedFloor) {
                classData.push({
                    className: columns[3],
                    capacity: columns[4],
                    currentUsers: columns[5],
                    periods: columns.slice(6)
                });
            }
        }

        return classData;
    }

    // CSVファイルから時間帯情報を読み込む関数
    async function fetchTimetable() {
        const response = await fetch(timetableCSV);
        const text = await response.text();
        const lines = text.split("\n");
        const timetable = {};

        // CSVの各行から時間帯情報を抽出
        for (let i = 0; i < lines.length; i++) {
            const columns = lines[i].split(",");
            if (columns.length >= 2) {
                timetable[i + 1] = {
                    startTime: parseInt(columns[0]),
                    endTime: parseInt(columns[1])
                };
            }
        }

        return timetable;
    }

    // 教室情報を表示
    const classData = await fetchClassData();
    const timetable = await fetchTimetable();

    classData.forEach(classInfo => {
        const classBox = document.createElement("div");
        classBox.classList.add("class-box");
        
        // 時間帯ごとに処理
        classInfo.periods.forEach((period, index) => {
            const periodTime = timetable[index + 1];

            // 現在時刻と時間帯を比較して色を設定
            if (period === "1" && currentTime >= periodTime.startTime && currentTime <= periodTime.endTime) {
                classBox.classList.add("yellow");
            }
        });

        classBox.textContent = `${classInfo.className}・${classInfo.currentUsers}/${classInfo.capacity}`;
        classGrid.appendChild(classBox);

        // ボックスのクリックイベント
        classBox.addEventListener("click", function(event) {
            const clickedBox = event.target.textContent;
            if (clickedBox) {
                // 次のページに遷移（table.htmlなど）
                // ここで選択された教室名・学部・棟・階層を渡すなどの処理を行う
                window.location.href = `https://ichiken26.github.io/search_class/table?faculty=${selectedFaculty}&building=${selectedBuilding}&floor=${selectedFloor}&class=${classInfo.className}`;
            }
        });
    });
});
async function fetchClassTimes() {
    const timetableCSV = "https://ichiken26.github.io/search_class/media/timetable.csv";

    const response = await fetch(timetableCSV);
    const text = await response.text();
    const lines = text.split("\n");

    const currentTime = new Date(); // 現在時刻を取得
    const currentHHMM = `${String(currentTime.getHours()).padStart(2, "0")}${String(currentTime.getMinutes()).padStart(2, "0")}`;
    
    let classTimes = [];

    for (let i = 1; i < lines.length; i++) {
        const [time_start, time_stop] = lines[i].split(",");
        if (currentHHMM >= time_start && currentHHMM <= time_stop) {
            classTimes.push(`${i}限`);
        }
    }

    return classTimes;
}


  

document.addEventListener("DOMContentLoaded", async function() {
    const classInfoElement = document.getElementById("h1tag");
    const is_class = document.getElementById("isclass");
    const timetableTable = document.getElementById("timetable");

    const classTimes = await fetchClassTimes();

    if (classTimes.length > 0) {
        localStorage.setItem('classTimes', classTimes);
        is_class.textContent = `現在は${classTimes}です`
    } else {
        classInfoElement.textContent = "授業時間外です";
        return;
    }

    const facultyList = document.getElementById("faculty-list");

    // CSVファイルのURL
    const classesCSV = "../media/classes.csv";

    // CSVファイルから学部情報を読み込む関数
    async function fetchFaculties() {
        const response = await fetch(classesCSV);
        const text = await response.text();
        const lines = text.split("\n");
        const faculties = new Set();

        // CSVの学部列から学部情報を抽出
        for (let i = 1; i < lines.length; i++) { // ヘッダーをスキップ
            const columns = lines[i].split(",");
            if (columns.length >= 1) {
                faculties.add(columns[0]);
            }
        }

        return Array.from(faculties);
    }

    // 学部情報を表示
    const faculties = await fetchFaculties();
    faculties.forEach(faculty => {
        const listItem = document.createElement("li");
        listItem.textContent = faculty;
        facultyList.appendChild(listItem);
    });

    // 学部リストのクリックイベント
    facultyList.addEventListener("click", function(event) {
        const clickedFaculty = event.target.textContent;
        if (clickedFaculty) {
            // 次のページに遷移（building.htmlなど）
            // ここで選択された学部を渡すなどの処理を行う
            window.location.href = `https://ichiken26.github.io/search_class/nowtime/classtable?faculty=${clickedFaculty}`;
        }
    });
});


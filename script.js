document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const messageScreen = document.getElementById('messageScreen');
    const buttonScreen = document.getElementById('buttonScreen');
    const courseSelectionScreen = document.getElementById('courseSelectionScreen');
    const mapScreen = document.getElementById('mapScreen');
    const message = document.getElementById('message');
    const startButton = document.getElementById('startButton');
    const createScheduleButton = document.getElementById('createScheduleButton');
    const randomizeScheduleButton = document.getElementById('randomizeScheduleButton');
    const description = document.getElementById('description');
    const courseList = document.getElementById('courseList');
    const courseCount = document.getElementById('courseCount');
    const optimizeButton = document.getElementById('optimizeButton');

    const courses = {
        Language: ['English Literature I [LANG001]', 'English Literature II [LANG002]', 'English Literature III [LANG003]', 'English Literature IV [LANG004]', 'Spanish I [LANG005]', 'Spanish II [LANG006]', 'Chinese I [LANG007]', 'Chinese II [LANG008]'],
        Mathematics: ['Algebra I Foundations [MAT001]', 'Algebra I Standard Core [MAT102]', 'Algebra I Honors [MAT201]', 'Algebra II Foundations [MAT007]','Algebra II Standard Core [MAT008]', 'Algebra II Honors [MAT009]', 'Geometry Foundations [MAT004]', 'Geometry Standard Core [MAT005]', 'Geometry Honors [MAT006]'],
        'Social Studies': ['Economics and Personal Finance [S001]','Government and Politics [S002]', 'Civic Literacy [S003]', 'World History [S004]', 'Sociology [S005]', 'European History [S006]', 'Psychology [S007]', 'American Indian and Indigenous Studies [S008]', 'African American History [S009]'],
        Sciences: ['Integrated Sciences [SCI001]', 'Biology [SCI002]', 'Molecular Biology [SCI003]', 'Intro to Physics [SCI004]', 'Physics: Mechanics [SCI005]', 'Physics: Electricity and Magnetism [SCI006]', 'Intro to Chemistry [SCI007]', 'College Chemistry [SCI008]', 'Earth & Environmental Science [SCI009]', 'Ecology [SCI010]', 'Astronomy [SCI011]', 'Oceanography [SCI012]'],
        Electives: ['JROTC [MISC001]', 'Automotive [MISC002]', 'Literature Magazine [MISC003]', 'Newspaper [MISC004]', 'Yearbook [MISC005]', 'Speech & Debate [MISC006]', 'Weightlifting [MISC007]', 'Business [MISC008]', 'Marketing [MISC010]', '2D Art & Design [ART001]', '3D Art & Design [ART002]', 'Orchestra [ART003]', 'Jazz Ensemble [ART004]', 'Band [ART005]', 'Choral Ensemble [ART006]', 'Drama [ART007]', 'Tech Theatre [ART008]', 'Dance [ART009]']
    };

    const selectedCourses = [];
    let mapData;

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        messageScreen.style.display = 'block';
        showMessage("Welcome to the School Schedule Simulator! Ready to optimize your day?", true);
    });

    messageScreen.addEventListener('click', () => {
        showMessage("Let's get started then!", false);
    });

    function showMessage(text, waitForClick) {
        message.textContent = text;
        message.style.opacity = 1;

        if (!waitForClick) {
            setTimeout(() => {
                message.style.opacity = 0;
                setTimeout(() => {
                    messageScreen.style.display = 'none';
                    buttonScreen.style.display = 'block';
                }, 1000);
            }, 2000);
        }
    }

    createScheduleButton.addEventListener('click', () => {
        buttonScreen.style.display = 'none';
        courseSelectionScreen.style.display = 'block';
        populateCourseLists();
    });

    function populateCourseLists() {
        for (const subject in courses) {
            let selectId, optionsId, addButtonId;
            
            if (subject === 'Social Studies') {
                selectId = "socialStudiesSelect";
                optionsId = "socialStudiesOptions";
                addButtonId = "addSocialStudies";
            } else {
                selectId = subject.toLowerCase().replace(/\s+/g, '') + "Select";
                optionsId = subject.toLowerCase().replace(/\s+/g, '') + "Options";
                addButtonId = "add" + subject.replace(/\s+/g, '');
            }
            
            const select = document.getElementById(selectId);
            const optionsContainer = document.getElementById(optionsId);
            const addButton = document.getElementById(addButtonId);

            if (select && optionsContainer && addButton) {
                optionsContainer.innerHTML = '';
                courses[subject].forEach(course => {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = "course-option";
                    optionDiv.textContent = course;
                    optionDiv.addEventListener('click', () => {
                        select.textContent = course;
                        select.style.color = 'black';
                        optionsContainer.style.display = "none";
                    });
                    optionsContainer.appendChild(optionDiv);
                });

                select.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeAllOptions();
                    optionsContainer.style.display = optionsContainer.style.display === "block" ? "none" : "block";
                });

                addButton.addEventListener('click', () => addCourse(subject, select.textContent));
            } else {
                console.error(`Elements not found for ${subject}:`, { select, optionsContainer, addButton });
            }
        }

        document.addEventListener('click', closeAllOptions);
    }

    function closeAllOptions() {
        document.querySelectorAll('.course-options').forEach(el => el.style.display = "none");
    }

    function addCourse(subject, course) {
        if (selectedCourses.length < 8 && course !== `Select a ${subject} course`) {
            if (!selectedCourses.includes(course)) {
                selectedCourses.push(course);
                updateCourseList();
                resetSubjectSelect(subject);
            } else {
                console.log("Course already selected");
            }
        } else if (selectedCourses.length >= 8) {
            console.log("Maximum number of courses reached");
        } else {
            console.log("Please select a course before adding");
        }
    }

    function updateCourseList() {
        courseList.innerHTML = '';
        selectedCourses.forEach((course, index) => {
            const li = document.createElement('li');
            li.textContent = course;
            const deleteButton = document.createElement('span');
            deleteButton.textContent = '❌';
            deleteButton.className = 'delete-course';
            deleteButton.onclick = () => deleteCourse(index);
            li.appendChild(deleteButton);
            courseList.appendChild(li);
        });
        courseCount.textContent = selectedCourses.length;
        optimizeButton.style.display = selectedCourses.length === 8 ? "block" : "none";
    }

    function deleteCourse(index) {
        selectedCourses.splice(index, 1);
        updateCourseList();
    }

    function resetSubjectSelect(subject) {
        let selectId;
        if (subject === 'Social Studies') {
            selectId = "socialStudiesSelect";
        } else {
            selectId = subject.toLowerCase().replace(/\s+/g, '') + "Select";
        }
        const select = document.getElementById(selectId);
        if (select) {
            select.textContent = `Select a ${subject} course`;
            select.style.color = 'gray';
        }
    }

    optimizeButton.addEventListener('click', optimizeSchedule);

    // Load map data
    fetch('map_data.yaml')
        .then(response => response.text())
        .then(text => {
            mapData = jsyaml.load(text);
            console.log("Map data loaded:", mapData);
        })
        .catch(error => console.error("Error loading map data:", error));

    function optimizeSchedule() {
        if (!mapData) {
            console.error("Map data not loaded yet");
            return;
        }
        courseSelectionScreen.style.display = 'none';
        mapScreen.style.display = 'block';

        drawMap();
        const optimizedSchedule = optimizeCourseOrder(selectedCourses);
        animatePath(optimizedSchedule);
        displaySchedule(optimizedSchedule);
    }

    function drawMap() {
        const svg = document.getElementById('mapSvg');
        svg.innerHTML = '';

        mapData.buildings.forEach(building => {
            const buildingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            const buildingRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            buildingRect.setAttribute('x', building.position.x);
            buildingRect.setAttribute('y', building.position.y);
            buildingRect.setAttribute('width', 100);
            buildingRect.setAttribute('height', 200);
            buildingRect.setAttribute('class', 'building');
            buildingGroup.appendChild(buildingRect);

            const buildingLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            buildingLabel.setAttribute('x', building.position.x + 50);
            buildingLabel.setAttribute('y', building.position.y + 20);
            buildingLabel.setAttribute('class', 'building-label');
            buildingLabel.textContent = building.name;
            buildingGroup.appendChild(buildingLabel);

            svg.appendChild(buildingGroup);
        });

        // Draw classrooms
        for (const [classroomId, position] of Object.entries(mapData.classrooms)) {
            const classBox = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            classBox.setAttribute('x', position.x);
            classBox.setAttribute('y', position.y);
            classBox.setAttribute('width', mapData.class_sizes.width);
            classBox.setAttribute('height', mapData.class_sizes.height);
            classBox.setAttribute('class', 'class-box');
            svg.appendChild(classBox);
        }
    }

    function optimizeCourseOrder(courses) {
        const classrooms = courses.map(course => {
            const match = course.match(/\[(\w+\d+)\]/);
            return match ? match[1] : null;
        }).filter(Boolean);

        const optimizedOrder = [classrooms[0]];
        const remaining = new Set(classrooms.slice(1));

        while (remaining.size > 0) {
            const current = optimizedOrder[optimizedOrder.length - 1];
            let nearest = null;
            let minDistance = Infinity;

            for (const classroom of remaining) {
                const distance = calculateDistance(current, classroom);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = classroom;
                }
            }

            optimizedOrder.push(nearest);
            remaining.delete(nearest);
        }

        return optimizedOrder.map(classroom => 
            courses.find(course => course.includes(classroom))
        );
    }

    function calculateDistance(classroom1, classroom2) {
        const pos1 = mapData.classrooms[classroom1];
        const pos2 = mapData.classrooms[classroom2];
        if (!pos1 || !pos2) {
            console.error("Classroom position not found:", classroom1, classroom2);
            return Infinity;
        }
        return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
    }

    function animatePath(schedule) {
        const svg = document.getElementById('mapSvg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'path');
        svg.appendChild(path);

        let pathData = '';
        let animationDelay = 0;

        schedule.forEach((course, index) => {
            const classroom = course.match(/\[(\w+\d+)\]/)[1];
            const position = mapData.classrooms[classroom];
            if (!position) {
                console.error("Classroom position not found:", classroom);
                return;
            }
            const {x, y} = position;

            if (index === 0) {
                pathData += `M ${x + mapData.class_sizes.width/2} ${y + mapData.class_sizes.height/2}`;
            } else {
                pathData += ` L ${x + mapData.class_sizes.width/2} ${y + mapData.class_sizes.height/2}`;
            }

            // Add number label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', x + mapData.class_sizes.width/2);
            text.setAttribute('y', y + mapData.class_sizes.height/2);
            text.setAttribute('class', 'path-label');
            text.textContent = index + 1;
            svg.appendChild(text);
        });

        path.setAttribute('d', pathData);
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        setTimeout(() => {
            path.style.transition = `stroke-dashoffset 2s ease-in-out`;
            path.style.strokeDashoffset = '0';
        }, 100);
    }

    function displaySchedule(schedule) {
        const scheduleDisplay = document.getElementById('scheduleDisplay');
        scheduleDisplay.innerHTML = '<h3>Your Optimized Schedule:</h3>';
        const scheduleList = document.createElement('ol');
        schedule.forEach(course => {
            const li = document.createElement('li');
            li.textContent = course;
            scheduleList.appendChild(li);
        });
        scheduleDisplay.appendChild(scheduleList);
    }
});

import { useState, useEffect } from "react";
import Select from "react-select";
import "../../scss/main.scss";
import styles from "./App.module.scss";
import { Clipboard, Gift, Heart } from "react-feather";
import { Apple } from "../../assets/svgs/apple";
import { IGroups } from "../../interfaces/IGroups";
import { ICourses } from "../../interfaces/ICourses";

function App() {
  /**
   * States for all the selectors
   */
  const [selectedGroup, setSelectedGroup] = useState<IGroups>();
  const [selectedCourses, setSelectedCourses] = useState<ICourses[]>([
    { value: "EDA452", label: "Grundläggande datorteknik" },
    { value: "TDA555", label: "Intro till funktionell programmering" },
    { value: "TMV211", label: "Inledande diskret matematik" },
    { value: "DAT044", label: "Intro till OOP" },
  ]);
  const [checkedLocation, setCheckedLocation] = useState<boolean>(true);
  const [checkedExam, setCheckedExam] = useState<boolean>(true);
  const [calendarUrl, setCalendarUrl] = useState<string>("");

  /**
   * Group options for react-select component
   * @param {string} value
   * @param {string} label
   */
  const groups: IGroups[] = [
    { value: "A", label: "Group A" },
    { value: "B", label: "Group B" },
    { value: "C", label: "Group C" },
    { value: "D", label: "Group D" },
    { value: "E", label: "Group E" },
    { value: "F", label: "Group F" },
    { value: "G", label: "Group G" },
  ];

  /**
   * Group options for react-select component
   * @param {string} value    Value used for the option
   * @param {string} label    Value used as display text
   */
  const courses: ICourses[] = [
    { value: "EDA452", label: "Grundläggande datorteknik" },
    { value: "TDA555", label: "Intro till funktionell programmering" },
    { value: "TMV211", label: "Inledande diskret matematik" },
    { value: "DAT044", label: "Intro till OOP" },
  ];

  /**
   * Handles the change of the react-select component for the group
   * @param {IGroups | IGroups[] | null} selected§    Value of the selected group
   */
  const handleGroupChange = (selected?: IGroups | IGroups[] | null) => {
    setSelectedGroup(selected as IGroups);
    getIcalLink(
      selected as IGroups,
      selectedCourses as ICourses[],
      checkedLocation as boolean,
      checkedExam as boolean
    );
  };

  /**
   * Handles the change of the react-select component for the courses
   * @param {ICourses | ICourses[] | null} selected   Value of the selected course
   */
  const handleCoursesChange = (selected: readonly ICourses[]) => {
    setSelectedCourses(selected as ICourses[]);
    getIcalLink(
      selectedGroup as IGroups,
      selected as ICourses[],
      checkedLocation as boolean,
      checkedExam as boolean
    );
  };

  /**
   * Handles the change for the location checkbox
   * @param {boolean} checked   State of the location checkbox
   */
  const handleLocationChecked = (checked: boolean) => {
    setCheckedLocation(checked);
    getIcalLink(
      selectedGroup as IGroups,
      selectedCourses as ICourses[],
      checked as boolean,
      checkedExam as boolean
    );
  };

  /**
   * Handles the change for the exam checkbox
   * @param {boolean} checked   State of the exams checkbox
   */
  const handleExamsChecked = (checked: boolean) => {
    setCheckedExam(checked);
    getIcalLink(
      selectedGroup as IGroups,
      selectedCourses as ICourses[],
      checkedLocation as boolean,
      checked as boolean
    );
  };

  /**
   * Calls the API to get the .ical link
   * @param {IGroups} group     The selected group
   * @param {ICourses} courses  The selected courses
   * @param {boolean} location  State of location checkbox
   * @param {boolean} exam      State if exams checkbox
   */
  async function getIcalLink(
    group: IGroups,
    courses: ICourses[],
    location: boolean,
    exam: boolean
  ) {
    if (group && courses && courses.length > 0) {
      const request = {
        group: group.value,
        modLocation: location,
        modExam: exam,
        courses: courses.map((course: ICourses) => course.value),
      };

      fetch("/api/v1/getUrl/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })
        .then((response) => response.json())
        // This will later replace the setUrlInput above
        .then((json) => setCalendarUrl(json.url));
    }
  }

  /**
   * Handles the copy to clipboard functionality
   */
  const copyUrlToClipboard = async () => {
    await navigator.clipboard.writeText(calendarUrl);
    alert("Copied to clipboard!");
  };

  /**
   * Converts the calendar url to a calender link
   */
  let webCalUrl = calendarUrl.replace(/https/gi, "webcal");

  /**
   * Runs at start and sets the .ical link
   */
  useEffect(() => {
    getIcalLink(
      selectedGroup as IGroups,
      selectedCourses as ICourses[],
      checkedLocation as boolean,
      checkedExam as boolean
    );
  }, []);

  return (
    <div className={styles.app}>
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>DSchema-1 | Subscribe</h2>
          <div>
            <h4
              className={[styles.subtitle, styles.tooltip].join(" ")}
              data-tooltip="Choose your GruDat subgroup"
            >
              Choose group
            </h4>
            <div className={styles.items}>
              <Select
                className={styles.react_select_container}
                placeholder="Choose GruDat subgroup"
                defaultValue={selectedGroup}
                onChange={handleGroupChange}
                options={groups}
              />
            </div>
          </div>
          {selectedGroup && selectedGroup.value && (
            <>
              <div>
                <h4
                  className={[styles.subtitle, styles.tooltip].join(" ")}
                  data-tooltip="Choose your courses to subscribe to"
                >
                  Choose Courses
                </h4>
                <div className={styles.items}>
                  <Select
                    className={styles.react_select_container}
                    isMulti
                    closeMenuOnSelect={false}
                    defaultValue={selectedCourses}
                    onChange={handleCoursesChange}
                    options={courses}
                  />
                </div>
              </div>
              <div>
                <h4
                  className={[styles.subtitle, styles.tooltip].join(" ")}
                  data-tooltip="Modifications to the calendar"
                >
                  Modifications
                </h4>
                <div
                  className={[styles.items, styles["items--checkboxes"]].join(
                    " "
                  )}
                >
                  <label className={styles.checkbox}>
                    Improved titles ( Cource | Type )
                    <input
                      name="mod1"
                      type="checkbox"
                      onChange={() => handleLocationChecked(!checkedLocation)}
                      checked={checkedLocation}
                    />
                    <span className={styles.checkbox__checkmark} />
                  </label>
                  <label className={styles.checkbox}>
                    Include exams and signups
                    <input
                      name="mod2"
                      type="checkbox"
                      onChange={() => handleExamsChecked(!checkedExam)}
                      checked={checkedExam}
                    />
                    <span className={styles.checkbox__checkmark} />
                  </label>
                </div>
              </div>
              {selectedCourses && selectedCourses.length !== 0 && (
                <div className={styles.calendar_url}>
                  <h4
                    className={[styles.subtitle, styles.tooltip].join(" ")}
                    data-tooltip="Should work with most calendar apps"
                  >
                    Calendar URL
                  </h4>
                  <div
                    className={[
                      styles.items,
                      styles["items--calendar_url"],
                    ].join(" ")}
                  >
                    <a
                      href={webCalUrl}
                      target={"_blank"}
                      className={styles.calendar_url__primary_button}
                    >
                      <Apple /> Subscripe to calendar
                    </a>
                    <p>or copy the calendar url</p>
                    <button
                      onClick={copyUrlToClipboard}
                      className={styles.calendar_url__secondary_button}
                    >
                      <Clipboard size={16} /> Copy to clipboard
                    </button>
                    <p>Or copy manually</p>
                    <input
                      className={styles.calendar_url__url_input}
                      type="text"
                      readOnly={true}
                      value={calendarUrl}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          <div className={styles.credits}>
            <p className={styles.credits__made_with}>
              Made with
              <Heart
                className={styles["credits__made_with--heart"]}
                size={16}
              />
              in Gothenburg, Sweden
            </p>
            <p>Credits: Whupper & PEZ</p>
            <p>A small donation never hurts :)</p>
            <a
              className={styles.credits__paypal}
              href="https://paypal.me/memgod"
            >
              <Gift size={16} />
              PayPal
            </a>
            <p className={styles.credits__disclaimer}>
              <span>DISCLAIMER</span>: We do not take responsibility for missed
              lectures and exams caused by any bugs on this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

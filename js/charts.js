function decimalAdjust(type, value, exp) {
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }

  value = +value;
  exp = +exp;

  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }

  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
}

if (!Math.round10) {
  Math.round10 = function (value, exp) {
    return decimalAdjust('round', value, exp);
  };
}

var isMobile = window.matchMedia("only screen and (max-width: 1023px)").matches;
var studentData = {},
    educatorData = {},
    surveyData,
    tooltips = {},
    chartMargin = {
  top: 40,
  right: 0,
  bottom: 90,
  left: 0
},
    rx = 5,
    ry = 5,
    marginsBarMobile = {
  top: 5,
  right: 95,
  bottom: 5,
  left: 100
},
    marginsBar,
    marginsStacked,
    marginsStacked2;
var altText = {
  educator: {
    gender: {
      all: `Gender of educators directly reached during the 2019-20 school year by the eight Alliances.  Among 1,880 educators, 12% were Male, and 27.9% were Female. At the time of data collection, we have no gender information for 59.7% of educators.`,
      "PreK–12 teachers and administrators": `Gender of PreK-12 teachers and administrators directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no gender information for educators at this level.`,
      "Faculty and administrators at 2-year IHEs": `Gender of Faculty and administrators at 2-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no gender information for all 181 educators at this level.`,
      "Faculty, postdocs, graduate students, and administrators at 4-year IHEs": `Gender of faculty, postdocs, graduate students, and administrators at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  Among 1,554 Faculty, postdocs, graduate students, and administrators at 4-year IHEs, 13.9% were Male, and 31.9% were Female. At the time of data collection, we have no gender information for 53.9% of educators at this level.`,
      "IHE faculty (cannot distinguish between faculty and administrators at associate colleges, doctoral-granting institutions, masters colleges and universities, or baccalaureate colleges)": `Gender of IHE faculty directly reached during the 2019-20 school year by the eight Alliances.  Among 104 IHE faculty, 1.9% were Male, and 1.9% were Female. At the time of data collection, we have no gender information for 96.2% of educators at this level.`,
      "PreK-20 educators (cannot distinguish educator levels)": `Gender of PreK-20 educators directly reached during the 2019-20 school year by the eight Alliances.  Among 41 PreK-20 educators, 17.1% were Male, and 65.9% were Female. At the time of data collection, we have no gender information for 12.2% of educators at this level.`
    },
    ethnicity: {
      all: `Ethnicity of educators directly reached during the 2019-20 school year by the eight Alliances.  Among 1,880 educators, 4.0% were Hispanic/Latinx and 31.4% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 64.5% of educators at this level.`,
      "PreK–12 teachers and administrators": `Ethnicity of PreK-12 teachers and administrators directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no gender information for educators at this level.`,
      "Faculty and administrators at 2-year IHEs": `Ethnicity of Faculty and administrators at 2-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no gender information for all 181 educators at this level.`,
      "Faculty, postdocs, graduate students, and administrators at 4-year IHEs": `Ethnicity of faculty, postdocs, graduate students, and administrators at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  Among 1,554 Faculty, postdocs, graduate students, and administrators at 4-year IHEs, 4.6% were Hispanic/Latinx and 36.4% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 59.0% of educators at this level.`,
      "IHE faculty (cannot distinguish between faculty and administrators at associate colleges, doctoral-granting institutions, masters colleges and universities, or baccalaureate colleges)": `Ethnicity of IHE faculty directly reached during the 2019-20 school year by the eight Alliances.  Among 104 IHE faculty, 0.0% were Hispanic/Latinx and 3.8% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 96.2% of educators at this level.`,
      "PreK-20 educators (cannot distinguish educator levels)": `Ethnicity of PreK-20 educators directly reached during the 2019-20 school year by the eight Alliances.  Among 41 PreK-20 educators, 9.8% were Hispanic/Latinx and 48.8% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 41.5% of educators at this level.`
    },
    race: {
      all: `Race of educators directly reached during the 2019-20 school year by the eight Alliances.  Among 1,880 educators, 0.3% were American Indian or Alaska Native, 3.4% were Asian or Asian American, 6.4% were Black or African American, 24.3% were white, and 2.3% were another race or multiple races. At the time of data collection, we have no race information for 62.6% of educators.`,
      "PreK–12 teachers and administrators": `Race of PreK-12 teachers and administrators directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no race information for educators at this level.`,
      "Faculty and administrators at 2-year IHEs": `Race of Faculty and administrators at 2-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no race information for all 181 educators at this level.`,
      "Faculty, postdocs, graduate students, and administrators at 4-year IHEs": `Race of faculty, postdocs, graduate students, and administrators at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  Among 1,554 Faculty, postdocs, graduate students, and administrators at 4-year IHEs, 0.4% were American Indian or Alaska Native, 4.0% were Asian or Asian American, 6.9% were Black or African American, 28.2% were white, 0.1% were Native Hawaiian or other pacific islander, 0.7% were Middle Eastern or Northern African, and 2.8% were another race or multiple races. At the time of data collection, we have no race information for 56.9% of educators at this level.`,
      "IHE faculty (cannot distinguish between faculty and administrators at associate colleges, doctoral-granting institutions, masters colleges and universities, or baccalaureate colleges)": `Race of IHE faculty directly reached during the 2019-20 school year by the eight Alliances.  Among 104 IHE faculty, 1.0% were Black or African American. At the time of data collection, we have no race information for 99% (103) educators at this level at this level.`,
      "PreK-20 educators (cannot distinguish educator levels)": `Race of PreK-20 educators directly reached during the 2019-20 school year by the eight Alliances.  Among 41 PreK-20 educators, 2.4% were Asian or Asian American, 29.3% were Black or African American, 13.9% were white, and 2.4% were another race or multiple races. At the time of data collection, we have no race information for 22.0% of educators at this level at this level.`
    }
  },
  student: {
    gender: {
      all: `Gender of Prek-20 students directly reached during the 2019-20 school year by the eight Alliances.  Among 1,925 PreK-20 students, 18.9% were Male, and 17.9% were Female. At the time of data collection, we have no gender information for 63% of students.`,
      "Elementary school students": `Gender of Elementary school students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Middle school students": `Gender of Middle school students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "High school students": `Gender of High students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Other PreK–12 students (cannot distinguish K-12 levels)": `Gender of Other PreK–12 students (cannot distinguish PreK–12 levels) directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Undergraduate students at 2-year institutions of higher education (IHEs)": `Gender of Undergraduate students at 2-year institutions of higher education (IHEs) directly reached during the 2019-20 school year by the eight Alliances.  Among 358 Undergraduate students at 2-year institutions of higher education (IHEs), 62.3% were male and 33.5% were Female.`,
      "Undergraduate students at 4-year IHEs": `Gender of 1,925 Undergraduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  Among 980 students, 10.7% were male and 9.3% were female. At the time of data collection, we have no gender information for 79.3% of students at this level.`,
      "Graduate students at 4-year IHEs": `Gender of Graduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no gender information for all 78 students at this level.`,
      "Post-secondary students (cannot distinguish IHE levels)": `Gender of Post-secondary students (cannot distinguish IHE levels) directly reached during the 2019-20 school year by the eight Alliances.  Among 509 Post-secondary students, 6.9% were male and 26.3% were female. At the time of data collection, we have no gender information for 58.9% students at this level.`,
      "PreK-20 students (cannot distinguish K-20 levels)": `Gender of Pre-K–20 students (cannot distinguish PreK–20 levels) directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`
    },
    ethnicity: {
      all: `Ethnicity of Prek-20 students directly reached during the 2019-20 school year by the eight Alliances.  Among 1,925 PreK-20 students, 4.8% were Hispanic/Latinx and 14.1% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 81.1% of students.`,
      "Elementary school students": `Ethnicity of Elementary school students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Middle school students": `Ethnicity of Middle school students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "High school students": `Ethnicity of High students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Other PreK–12 students (cannot distinguish K-12 levels)": `Ethnicity of Other Prek-12 students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Undergraduate students at 2-year institutions of higher education (IHEs)": `Ethnicity of Undergraduate students at 2-year institutions of higher education (IHEs) directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no ethnicity information for all 358 students at this level.`,
      "Undergraduate students at 4-year IHEs": `Ethnicity of 1,925 Undergraduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  Among 980 Undergraduate students at 4-year IHEs, 8.9% were Hispanic/Latinx and 10.6% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 80.5% of students.`,
      "Graduate students at 4-year IHEs": `Ethnicity of Graduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  At the time of data collection, we have no ethnicity information for all 78 students at this level.`,
      "Post-secondary students (cannot distinguish IHE levels)": `Ethnicity of Post-secondary students (cannot distinguish IHE levels) directly reached during the 2019-20 school year by the eight Alliances.  Among 509 Post-secondary students, 1% were Hispanic/Latinx and 33% were not Hispanic/Latinx. At the time of data collection, we have no ethnicity information for 66% of students.`,
      "PreK-20 students (cannot distinguish K-20 levels)": `Ethnicity of Pre-K–20 students (cannot distinguish PreK–20 levels) directly reached during the 2019-20 school year by the eight Alliances,No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`
    },
    race: {
      all: `Race of Prek-20 students directly reached during the 2019-20 school year by the eight Alliances.  Among 1,925 students, 0.5% were American Indian or Alaska Native, 1.2% were Asian or Asian American, 0.1% were Native Hawaiian or Other Pacific, 18.5% were white, and 11.8% were another race or multiple races. At the time of data collection, we have no race information for 63.5% of students.`,
      "Elementary school students": `Race of Elementary school students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Middle school students": `Ethnicity of Middle school students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "High school students": `Ethnicity of High students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Other PreK–12 students (cannot distinguish K-12 levels)": `Race of Other Prek-12 students directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`,
      "Undergraduate students at 2-year institutions of higher education (IHEs)": `Race of Undergraduate students at 2-year institutions of higher education (IHEs) directly reached during the 2019-20 school year by the eight Alliances.  Among 358 Undergraduate students at 2-year institutions of higher education (IHEs), 49.4% were white and 46.4% were another race. At the time of data collection, we have no race information for 4.2% of students.`,
      "Undergraduate students at 4-year IHEs": `Race of 1,925 Undergraduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances.  Among Undergraduate students at 4-year IHEs, 0.8% were American Indian or Alaska Native, 1.9% were Asian or Asian American, 5.7% were black or African American, 0.1% were Native Hawaiian or Other Pacific, 5.2% were white, and 5.8% were another race or multiple races. At the time of data collection, we have no race information for 80.4% of students.`,
      "Graduate students at 4-year IHEs": `Race of Graduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no race information for all 78 students at this level.`,
      "Post-secondary students (cannot distinguish IHE levels)": `Race of Post-secondary students (cannot distinguish IHE levels) directly reached during the 2019-20 school year by the eight Alliances. Among 509 Post-secondary students, 0.4% were American Indian or Alaska Native, 1% were Asian or Asian American, 5.5% were black or African American, 25.1% were white, and 1% were another race or multiple races. At the time of data collection, we have no race information for 67% of students.`,
      "PreK-20 students (cannot distinguish K-20 levels)": `Race of Pre-K–20 students (cannot distinguish PreK–20 levels) directly reached during the 2019-20 school year by the eight Alliances.  No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.`
    }
  },
  survey: {
    Q2_A_2: {
      "all": `Survey responses of all respondents on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  Nearly three-fourths (72%) of 86 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Fourth-five respondents from Alliances with 2 years of funding were more likely to report significant progress or achievement in this area (76%, compared with 68% for 41 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  More than three-fourths (79%) of 43 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Thirteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (85%, compared with 77% for 30 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM,All 6 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  Just over half (52%) of 25 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Eight respondents from Alliances with 2 years of funding were more likely to report significant progress or achievement in this area (72.5%, compared with 47% for 17 respondents from projects with 3 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  More than three-fourths (77.7%) of 9 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Six respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (83.3%, compared with 66.6% for 3 respondents from projects with 2 years of funding).`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a plan that addresses systemic barriers to broadening participation in STEM,Two-thirds (66.7%) of 3 respondents (from 2 and 3 years of funding) indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM.`
    },
    Q3_A_1: {
      "all": `Survey responses of all respondents on Our project’s goals are informed by an assessment of the participant population’s needs.  Most (92%) of 83 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. Thirty-nine respondents from Alliances with 3 years of funding were more likely to somewhat or strongly agree with this statement (95%, compared with 89% for 44 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project’s goals are informed by an assessment of the participant population’s needs,Nearly all (95.3%) 42 respondents somewhat or strongly agreed that their project’s goals had been informed by an assessment of the needs of their participant population. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project’s goals are informed by an assessment of the participant population’s needs.  More than three-fourths (83.4%) of 6 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. All 3 respondents from Alliances with 3 years of funding somewhat or strongly agree with this statement, compared with 66.6% for 3 respondents from projects with 2 years of funding.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project’s goals are informed by an assessment of the participant population’s needs.  Most (85.4%) of 22 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. Fifteen respondents from Alliances with 3 years of funding were more likely to somewhat or strongly agree with this statement (85.7%, compared with 86.6% for 7 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project’s goals are informed by an assessment of the participant population’s needs.  Nine of 10 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. All 6 respondents from Alliances with 3 years of funding somewhat or strongly agreed with this statement, compared with 75% for 4 respondents from projects with 2 years of funding.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project’s goals are informed by an assessment of the participant population’s needs,All 3 respondents somewhat or strongly agreed that their project’s goals had been informed by an assessment of the needs of their participant population.`
    },
    Q4_A_1: {
      "all": `Survey responses of all respondents on All of our core partners are involved in the process of developing our project’s goals.  Most (93.8%) of 81 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals. Forty-two respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (59.5%, compared with 48.7% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners are involved in the process of developing our project’s goals.  Most (92.5%) of 40 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals. Twenty-seven respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (66.7%, compared with 61.5% for 13 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners are involved in the process of developing our project’s goals,All 6 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners are involved in the process of developing our project’s goals.  Nearly all (95.4%) 22 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals. All 7 respondents from Alliances with 2 years of funding somewhat or strongly agreed with this statement, compared with 93.3% for 15 respondents from projects with 3 years of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners are involved in the process of developing our project’s goals,All 10 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners are involved in the process of developing our project’s goals,Two of 3 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals.`
    },
    Q2_A_1: {
      "all": `Survey responses of all respondents on Our project has a plan that clearly specifies each partner’s role,More than three-fourths (81.2%) of 85 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role. There was no meaningful difference by year of funding.`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a plan that clearly specifies each partner’s role,Most (88.3%) of 43 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a plan that clearly specifies each partner’s role,All 6 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a plan that clearly specifies each partner’s role,Two-thirds (66.7%) of 24 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a plan that clearly specifies each partner’s role,Just over three-fourths (77.7%) of 9 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a plan that clearly specifies each partner’s role,Two of 3 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role.`
    },
    Q2_A_3: {
      "all": `Survey responses of all respondents on Our project adds new partners to address a given need (e.g., to access crucial expertise and/or additional participants)".  More than half (59.8%) of 87 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need. Forty respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (65%, compared with 55.4% for 47 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project adds new partners to address a given need.  Nearly two-thirds (65.9%) of 44 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need. Thirteen respondents from Alliances with 3 years of funding reported significant progress or achievement in this area (76.9%, compared with 61.3% for those 31 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project adds new partners to address a given need,Three of 6 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project adds new partners to address a given need,Half (50%) of 24 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project adds new partners to address a given need,Six of 10 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project adds new partners to address a given need,Two of 3 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need.`
    },
    Q4_A_5: {
      "all": `Survey responses of all respondents on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals.  Most (85.4%) of 82 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project. Thirty-eight respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (52.6%, compared with 43.2% for 44 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,More than three-fourths (83.8%) of 43 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,Four of 5 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project.`,
      "Partner organization": `Survey responses of respondents in the partner organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,Most (90.5%) of 21 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,Eight of 10 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,All 3 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project.`
    },
    Q4_A_6: {
      "all": `Survey responses of all respondents on The sum of our core and supporting partners reflect the diversity of our participant population,Nearly three-fourths (71.5%) of 84 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population. There was no meaningful difference by year of funding.`,
      "Lead Organization": `Survey responses of respondents in the lead organization on The sum of our core and supporting partners reflect the diversity of our participant population,More than three-fourths (76.8%) of 43 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on The sum of our core and supporting partners reflect the diversity of our participant population,Three of 6 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population.`,
      "Partner organization": `Survey responses of respondents in the partner organization on The sum of our core and supporting partners reflect the diversity of our participant population,More than two-thirds (68.2%) of 22 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on The sum of our core and supporting partners reflect the diversity of our participant population,Six of 10 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on The sum of our core and supporting partners reflect the diversity of our participant population,All 3 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population.`
    },
    Q5_A_1: {
      "all": `Survey responses of all respondents on My organization has clear goals for its contribution on the project.  More than three-fourths (84.2%) of 19 respondents somewhat or strongly agreed that their organization had clear goals for its contribution to the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (76.9%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization has clear goals for its contribution on the project.  More than three-fourths (84.2%) of 19 respondents somewhat or strongly agreed that their organization had clear goals for its contribution to the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (76.9%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q5_A_2: {
      "all": `Survey responses of all respondents on My organization is committed to implementing the project’s approach.  Most (94.7%) of 19 respondents somewhat or strongly agreed that their organization was committed to implementing their project’s approach. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization is committed to implementing the project’s approach.  Most (94.7%) of 19 respondents somewhat or strongly agreed that their organization was committed to implementing their project’s approach. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q5_A_3: {
      "all": `Survey responses of all respondents on My organization changes its activities to better align with the project’s approach.  Most (88.8%) of 18 respondents somewhat or strongly agreed that their organization had changed its activities to better align with the project’s approach. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (58.3%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization changes its activities to better align with the project’s approach.  Most (88.8%) of 18 respondents somewhat or strongly agreed that their organization had changed its activities to better align with the project’s approach. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (58.3%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q2_A_4: {
      "all": `Survey responses of all respondents on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods".  Just over three-fourths (76.5%) of 85 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods. Thirty-eight respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (84.2%, compared with 70.2% for 47 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods".  Three-fourths (75%) of 44 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods. Thirteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (84.7%, compared with 71% for 31 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". All 5 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". Three-fourths (75%) of 24 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods. Sixteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (87.6%, compared with 50% for 8 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". All 9 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". All 3 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods.`
    },
    Q2_A_5: {
      "all": `Survey responses of all respondents on Our project has the capacity to track progress across all partners (e.g., protocols, common metrics)". Nearly two-thirds (62%) of 82 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners. Thirty-nine respondents from Alliances with 3 years of funding were marginally more likely to report significant progress or achievement in this area (64%, compared with 60% for 43 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has the capacity to track progress across all partners,More than half (59.5%) of 42 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has the capacity to track progress across all partners,Four of 6 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has the capacity to track progress across all partners. Nearly three-fourths (72.7%) of 22 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners. Fifteen respondents from Alliances with 3 years of funding were marginally more likely to report significant progress or achievement in this area (86.7%, compared with 42.9% for 7 from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has the capacity to track progress across all partners,Six of 10 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has the capacity to track progress across all partners,Both respondents indicated that their project had made some progress toward or had not yet started developing the capacity to track progress across all partners.`
    },
    Q2_A_6: {
      "all": `Survey responses of all respondents on Our project uses data to make regular improvements. Nearly two-thirds (60.7%) of 84 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements. Thirty-eight respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (23.7%, compared with 19.6% for 46 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project uses data to make regular improvements. Just over two-thirds (68.2%) of 44 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements. Thirteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (38.5%, compared with 22.6% for 31 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project uses data to make regular improvements,All 6 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project uses data to make regular improvements. Nearly half (47.6%) of 21 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements. Fourteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (21.4%, compared with zero of 7 projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project uses data to make regular improvements,Four of 10 respondents indicated that their project had made significant progress toward using data to make regular improvements.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project uses data to make regular improvements,One of 3 respondents indicated that their project had made significant progress toward using data to make regular improvements.`
    },
    Q4_A_2: {
      "all": `Survey responses of all respondents on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data. Most (88.5%) of 78 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. Thirty-nine respondents from Alliances with 3 years of funding were slightly more likely to strongly agree with this statement (41%, compared with 33.3% for 39 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data. Most (92.1%) of 38 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. Thirteen respondents from Alliances with 3 years of funding were slightly more likely to strongly agree with this statement (61.5%, compared with 36% for 25 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,Five of 6 (83.3%) respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. Six respondents from Alliances with 2 and 3 years of funding were equally likely (66.7%) to strongly agree with this statement.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,Most (85.7%) of 21 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,All 10 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,One of 3 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data.`
    },
    Q5_A_4: {
      "all": `Survey responses of all respondents on My organization is involved in the process of making sense of data collected by the project. Nearly three-fourths (73.7%) of 19 respondents somewhat or strongly agreed that their organization was involved in the process of making sense of data collected by the Alliance. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (53.8%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization is involved in the process of making sense of data collected by the project. Nearly three-fourths (73.7%) of 19 respondents somewhat or strongly agreed that their organization was involved in the process of making sense of data collected by the Alliance. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (53.8%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q3_A_2: {
      "all": `Survey responses of all respondents on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders. Most (92.9%) of 85 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders. Forty-five respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (75.6%, compared with 62.5% for 40 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders. Nearly all (95.4%) 43 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 76.7% for 30 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders,All 6 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders. More than three-fourths (82.6%) of 23 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders. Sixteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (50%, compared with 42.9% for 7 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders,All 10 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders,All 3 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders.`
    },
    Q3_A_3: {
      "all": `Survey responses of all respondents on Our project leadership has structures in place to encourage full participation by all partners. Nearly all (95.3%) 85 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners. Forty-five respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (64.4%, compared with 42.5% for 40 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project leadership has structures in place to encourage full participation by all partners,All 43 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project leadership has structures in place to encourage full participation by all partners,All 6 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project leadership has structures in place to encourage full participation by all partners analysis of shared measurement data,More than three-fourths (82.6%) of 23 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project leadership has structures in place to encourage full participation by all partners,All 10 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project leadership has structures in place to encourage full participation by all partners,All 3 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`
    },
    Q3_A_4: {
      "all": `Survey responses of all respondents on Our project has internal procedures that minimize power imbalances among partners. Most (92.4%) of 79 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners. Forty-two respondents from Alliances with 2 years of funding were more likely to somewhat or strongly agree with this statement (97.6%, compared with 86.5% for 37 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has internal procedures that minimize power imbalances among partners,Nearly all (95%) of 40 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has internal procedures that minimize power imbalances among partners,More than three-fourths (83.4%) of 6 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has internal procedures that minimize power imbalances among partners,Most (86.4%) of 22 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has internal procedures that minimize power imbalances among partners,All 9 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has internal procedures that minimize power imbalances among partners,Both respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners.`
    },
    Q3_A_5: {
      "all": `Survey responses of all respondents on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist. Most (91.6%) of 83 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist. Forty-four respondents from Alliances with 2 years of funding were more likely to somewhat or strongly agree with this statement (97.7%, compared with 84.6% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,Nearly all (97.7%) 42 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,More than three-fourths (83.4%) of 6 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,More than three-fourths (77.3%) of 22 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,All 10 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,All 3 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist.`
    },
    Q3_A_6: {
      "all": `Survey responses of all respondents on Our project leadership provides opportunities for building relationships across partners. Nearly all (95.3%) 84 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners. Forty-four respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (70.5%, compared with 57.5% for 40 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project leadership provides opportunities for building relationships across partners. All 42 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 69% for 29 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project leadership provides opportunities for building relationships across partners,Five of 6 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project leadership provides opportunities for building relationships across partners,Most (86.9%) of 23 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project leadership provides opportunities for building relationships across partners,All 10 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project leadership provides opportunities for building relationships across partners,All 3 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners.`
    },
    Q3_A_7: {
      "all": `Survey responses of all respondents on Our project’s decision-making processes are transparent to those inside the project. Most (89.2%) of 83 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. Forty-four respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (59.1%, compared with 38.5% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project’s decision-making processes are transparent to those inside the project. Most (88.3%) of 43 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. Thirty respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (63.3%, compared with 46.2% for 13 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project’s decision-making processes are transparent to those inside the project. Two of 6 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. All 3 respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement, compared with 1 of 3 respondents from projects with 3 years of funding.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project’s decision-making processes are transparent to those inside the project. Most (90.9%) of 22 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. Sixteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (43.8%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project’s decision-making processes are transparent to those inside the project,All 10 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project’s decision-making processes are transparent to those inside the project,Both respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project.`
    },
    Q3_A_8: {
      "all": `Survey responses of all respondents on Our Project's decisions are informed by input from our participant population (e.g., through representation by members of the participant population on a steering committee)". More than three-fourths (83.3%) of 84 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population. Forty-five respondents from Alliances with 2 years of funding were slightly more likely to strongly agree with this statement (51.1%, compared with 46.2% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our Project's decisions are informed by input from our participant population. Most (93.1%) of 43 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population. Thirty respondents from Alliances with 2 years of funding were slightly more likely to strongly agree with this statement (63.3%, compared with 53.8% for 13 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our Project's decisions are informed by input from our participant population,Two of 3 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our Project's decisions are informed by input from our participant population,Nearly two-thirds (60.8%) of 23 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our Project's decisions are informed by input from our participant population,All 10 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our Project's decisions are informed by input from our participant population,Both respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population.`
    },
    Q4_A_3: {
      "all": `Survey responses of all respondents on All of our core partners collaborate with each other to align their actions. Most (87.6%) of 80 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions. Forty-one respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (53.7%, compared with 39% for 39 respondents from projects with 3 years of funding)"`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners collaborate with each other to align their actions,Most (92.3%) of 39 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners collaborate with each other to align their actions,Five of 6 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners collaborate with each other to align their actions,Most (86.4%) of 22 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners collaborate with each other to align their actions,Eight of 10 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners collaborate with each other to align their actions,Two of 3 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions.`
    },
    Q4_A_4: {
      "all": `Survey responses of all respondents on All of our core partners regularly seek advice from one another (e.g., effective strategies for addressing a given challenge)". Most (91.3%) of 80 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another. Forty-two respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (47.6%, compared with 39.5% for 38 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners regularly seek advice from one another. Most (94.9%) of 39 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another. Twenty-seven respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (55.6%, compared with 41.7% for 12 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners regularly seek advice from one another,Five of 6 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners regularly seek advice from one another,More than three-fourths (81.9%) of 22 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners regularly seek advice from one another,All 10 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners regularly seek advice from one another,All 3 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another.`
    },
    Q5_A_5: {
      "all": `Survey responses of all respondents on My organization shares its challenges, setbacks, and lessons learned with other partners on the project". Most (89.4%) of 19 respondents somewhat or strongly agreed that their organizations shared their challenges, setbacks, and lessons learned with other partners on the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (46.2%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project". Most (89.4%) of 19 respondents somewhat or strongly agreed that their organizations shared their challenges, setbacks, and lessons learned with other partners on the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (46.2%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`
    },
    Q5_A_6: {
      "all": `Survey responses of all respondents on My organization seeks advice from other partners on the project (e.g., effective strategies for addressing a given challenge)". Most (94.4%) of 18 respondents somewhat or strongly agreed that their organization seeks advice from other partners on the project. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (50%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization seeks advice from other partners on the project. Most (94.4%) of 18 respondents somewhat or strongly agreed that their organization seeks advice from other partners on the project. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (50%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q2_A_7: {
      "all": `Survey responses of all respondents on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM. Nearly three-fourths (70.1%) of 87 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM. Forty-one respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (80.5%, compared with 60.9% for 46 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Nearly two-thirds (62.8%) of 43 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,All 6 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Just over three-fourths (76%) of 25 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Seven of 10 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Two of 3 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM.`
    },
    Q2_A_8: {
      "all": `Survey responses of all respondents on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period. Under one-third (30.4%) of 79 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period. Forty respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (32.5%, compared with 28.2% for 39 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,One-third (33.3%) of 36 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,Under one-fifth (16.7%) of 6 respondents indicated that their project had a written plan that outlined a strategy for sustaining activities beyond the current award period.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,One-fifth (20.9%) of 24 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,Five of 10 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,One of 3 respondents indicated that their project had made significant progress toward developing a written plan that outlined a strategy for sustaining activities beyond the current award period.`
    },
    Q2_A_9: {
      "all": `Survey responses of all respondents on Our project has secured funding beyond the current award period. Just over one-tenth (12.1%) of 66 respondents indicated that their project had secured (or had made significant progress toward securing) funding beyond the current award period. Thirty-two respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (15.6%, compared with 8.8% for 34 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has secured funding beyond the current award period,Just over one-tenth (12.2%) of 33 respondents indicated that their project had secured (or had made significant progress toward securing) funding beyond the current award period. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has secured funding beyond the current award period,More than one-third (40%) of 5 respondents indicated that their project had made some progress toward securing funding beyond the current award period.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has secured funding beyond the current award period,Nearly one-fifth (17.6%) of 17 respondents indicated that their project had made significant progress toward securing funding beyond the current award period.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has secured funding beyond the current award period,One of 10 respondents indicated that their project had made significant progress toward securing funding beyond the current award period.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has secured funding beyond the current award period,The 1 respondent indicated that their project had not yet started securing funding beyond the current award period.`
    },
    Q3_A_9: {
      "all": `Survey responses of all respondents on Our project has a strategic vision of what activities will be sustained beyond the current award period. Nearly three-fourths (72.8%) of 77 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period. Forty respondents from Alliances with 2 years of funding were more likely to somewhat or strongly agree with this statement (82.5%, compared with 62.1% for 37 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,More than three-fourths (78.4%) of 37 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,Three of 5 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,Nearly one-third (59.1%) of 22 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,Nine of 10 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a strategic vision of what activities will be sustained beyond the current award period,One of 3 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period.`
    }
  }
};
var altText2 = {
  educator: {
    gender: {
      all: `Gender of educators directly reached during the 2019-20 school year by the eight Alliances. Among 1,349 educators, 16.7% were Male, and 38.8% were Female. At the time of data collection, 43.9% pf participants did not provided their gender information.	`,
      "PreK–12 teachers and administrators": `Gender of PreK-12 teachers and administrators directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no gender information for educators at this level.	`,
      "Faculty and administrators at 2-year IHEs": `Gender of Faculty and administrators at 2-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no gender information for all 181 educators at this level.	`,
      "Faculty, postdocs, graduate students, and administrators at 4-year IHEs": `Gender of faculty, postdocs, graduate students, and administrators at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. Among 1,304 Faculty, postdocs, graduate students, and administrators at 4-year IHEs, 16.6% were Male, and 38.0% were Female. At the time of data collection, 45.0% pf participants did not provided their gender information.	`,
      "IHE faculty (cannot distinguish between faculty and administrators at associate colleges, doctoral-granting institutions, masters colleges and universities, or baccalaureate colleges)": `Gender of IHE faculty directly reached during the 2019-20 school year by the eight Alliances. Among 4 IHE faculty, 50.0% were Male, and 50.0% were Female. 	`,
      "PreK-20 educators (cannot distinguish educator levels)": `Gender of PreK-20 educators directly reached during the 2019-20 school year by the eight Alliances. Among 41 PreK-20 educators, 17.1% were Male, and 65.9% were Female. At the time of data collection, 12.2% pf participants did not provided their gender information.	`
    },
    ethnicity: {
      all: `Ethnicity of educators directly reached during the 2019-20 school year by the eight Alliances. Among 1,349 educators, 5.6% were Hispanic/Latinx and 43.7% were not Hispanic/Latinx. At the time of data collection, 50.6% pf participants did not provided their ethnicity information.	`,
      "PreK–12 teachers and administrators": `Ethnicity of PreK-12 teachers and administrators directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no ethnicity information for educators at this level.	`,
      "Faculty and administrators at 2-year IHEs": `Ethnicity of Faculty and administrators at 2-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no gender information for all 181 educators at this level.	`,
      "Faculty, postdocs, graduate students, and administrators at 4-year IHEs": `Ethnicity of faculty, postdocs, graduate students, and administrators at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. Among 1,304 Faculty, postdocs, graduate students, and administrators at 4-year IHEs, 5.5% were Hispanic/Latinx and 43.4% were not Hispanic/Latinx. At the time of data collection, 51.1% pf participants did not provided their ethnicity information.	`,
      "IHE faculty (cannot distinguish between faculty and administrators at associate colleges, doctoral-granting institutions, masters colleges and universities, or baccalaureate colleges)": `Ethnicity of IHE faculty directly reached during the 2019-20 school year by the eight Alliances. All 4 IHE faculties were not Hispanic/Latinx.	`,
      "PreK-20 educators (cannot distinguish educator levels)": `Ethnicity of PreK-20 educators directly reached during the 2019-20 school year by the eight Alliances. Among 41 PreK-20 educators, 9.8% were Hispanic/Latinx and 48.8% were not Hispanic/Latinx. At the time of data collection, 41.5% pf participants did not provided their ethnicity information.	`
    },
    race: {
      all: `Race of educators directly reached during the 2019-20 school year by the eight Alliances. Among 1,299 educators, 0.5% were American Indian or Alaska Native, 4.8% were Asian or Asian American, 9.2% were Black or African American, 35.1% were white, and 3.5% were another race or multiple races. At the time of data collection, 45.9% pf participants did not provided their race information.	`,
      "PreK–12 teachers and administrators": `Race of PreK-12 teachers and administrators directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no race information for educators at this level.	`,
      "Faculty and administrators at 2-year IHEs": `Race of Faculty and administrators at 2-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no race information for all 181 educators at this level.	`,
      "Faculty, postdocs, graduate students, and administrators at 4-year IHEs": `Race of faculty, postdocs, graduate students, and administrators at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. Among 1,257 Faculty, postdocs, graduate students, and administrators at 4-year IHEs, 0.5% were American Indian or Alaska Native, 4.9% were Asian or Asian American, 8.5% were Black or African American, 34.8% were white, 0.2% were Native Hawaiian or other pacific islander, 0.9% were Middle Eastern or Northern African, and 3.5% were another race or multiple races. At the time of data collection, 46.7% pf participants did not provided their race information.	`,
      "IHE faculty (cannot distinguish between faculty and administrators at associate colleges, doctoral-granting institutions, masters colleges and universities, or baccalaureate colleges)": `Race of IHE faculty directly reached during the 2019-20 school year by the eight Alliances. One IHE faculty was Black or African American.	`,
      "PreK-20 educators (cannot distinguish educator levels)": `Race of PreK-20 educators directly reached during the 2019-20 school year by the eight Alliances. Among 41 PreK-20 educators, 2.4% were Asian or Asian American, 29.3% were Black or African American, 13.9% were white, and 2.4% were another race or multiple races. At the time of data collection, 22.2% pf participants did not provided their race information.	`
    }
  },
  student: {
    gender: {
      all: `Gender of Prek-20 students directly reached during the 2019-20 school year by the eight Alliances. Among 755 PreK-20 students, 48.1% were Male, and 457.7% were Female.	`,
      "Elementary school students": `Gender of Elementary school students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Middle school students": `Gender of Middle school students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "High school students": `Gender of High students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Other PreK–12 students (cannot distinguish K-12 levels)": `Gender of Other PreK–12 students (cannot distinguish PreK–12 levels) directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Undergraduate students at 2-year institutions of higher education (IHEs)": `Gender of Undergraduate students at 2-year institutions of higher education (IHEs) directly reached during the 2019-20 school year by the eight Alliances. Among 343 Undergraduate students at 2-year institutions of higher education (IHEs), 65.0% were male and 35.0% were Female.	`,
      "Undergraduate students at 4-year IHEs": `Gender of Undergraduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. Among 203 students, 51.7% were male and 44.8% were female. 	`,
      "Graduate students at 4-year IHEs": `Gender of Graduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no gender information for all 78 students at this level.	`,
      "Post-secondary students (cannot distinguish IHE levels)": `Gender of Post-secondary students (cannot distinguish IHE levels) directly reached during the 2019-20 school year by the eight Alliances. Among 209 Post-secondary students, 16.7% were male and 64.1% were female.	`,
      "PreK-20 students (cannot distinguish K-20 levels)": `Gender of Pre-K–20 students (cannot distinguish PreK–20 levels) directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`
    },
    ethnicity: {
      all: `Ethnicity of Prek-20 students directly reached during the 2019-20 school year by the eight Alliances. Among 512 PreK-20 students, 22.3% were Hispanic/Latinx and 66.0% were not Hispanic/Latinx.	`,
      "Elementary school students": `Ethnicity of Elementary school students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Middle school students": `Ethnicity of Middle school students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "High school students": `Ethnicity of High students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Other PreK–12 students (cannot distinguish K-12 levels)": `Ethnicity of Other Prek-12 students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Undergraduate students at 2-year institutions of higher education (IHEs)": `Ethnicity of Undergraduate students at 2-year institutions of higher education (IHEs) directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no ethnicity information for all 358 students at this level.	`,
      "Undergraduate students at 4-year IHEs": `Ethnicity of Undergraduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. Among 203 Undergraduate students at 4-year IHEs, 12.9% were Hispanic/Latinx and 51.2% were not Hispanic/Latinx. 	`,
      "Graduate students at 4-year IHEs": `Ethnicity of Graduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no ethnicity information for all 78 students at this level.	`,
      "Post-secondary students (cannot distinguish IHE levels)": `Ethnicity of Post-secondary students (cannot distinguish IHE levels) directly reached during the 2019-20 school year by the eight Alliances. Among 209 Post-secondary students, 2.4% were Hispanic/Latinx and 80.4% were not Hispanic/Latinx. 	`,
      "PreK-20 students (cannot distinguish K-20 levels)": `Ethnicity of Pre-K–20 students (cannot distinguish PreK–20 levels) directly reached during the 2019-20 school year by the eight Alliances,No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`
    },
    race: {
      all: `Race of Prek-20 students directly reached during the 2019-20 school year by the eight Alliances. Among 755 students, 1.3% were American Indian or Alaska Native, 3.2% were Asian or Asian American, 0.1% were Native Hawaiian or Other Pacific, 47.2% were white, and 7.6% were another race or multiple races. 	`,
      "Elementary school students": `Race of Elementary school students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Middle school students": `Ethnicity of Middle school students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "High school students": `Ethnicity of High students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Other PreK–12 students (cannot distinguish K-12 levels)": `Race of Other Prek-12 students directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`,
      "Undergraduate students at 2-year institutions of higher education (IHEs)": `Race of Undergraduate students at 2-year institutions of higher education (IHEs) directly reached during the 2019-20 school year by the eight Alliances. Among 343 Undergraduate students at 2-year institutions of higher education (IHEs), 51.6% were white and 48.4% were another race.	`,
      "Undergraduate students at 4-year IHEs": `Race of Undergraduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. Among 203 Undergraduate students at 4-year IHEs, 3.9% were American Indian or Alaska Native, 9.4% were Asian or Asian American, 27.6% were black or African American, 0.5% were Native Hawaiian or Other Pacific, 25.1% were white, and 26.1% were another race or multiple races.	`,
      "Graduate students at 4-year IHEs": `Race of Graduate students at 4-year IHEs directly reached during the 2019-20 school year by the eight Alliances. At the time of data collection, we have no race information for all 78 students at this level.	`,
      "Post-secondary students (cannot distinguish IHE levels)": `Race of Post-secondary students (cannot distinguish IHE levels) directly reached during the 2019-20 school year by the eight Alliances. Among 509 Post-secondary students, 1.0% were American Indian or Alaska Native, 2.4% were Asian or Asian American, 13.4% were black or African American, 61.2% were white, and 2.4% were another race or multiple races.	`,
      "PreK-20 students (cannot distinguish K-20 levels)": `Race of Pre-K–20 students (cannot distinguish PreK–20 levels) directly reached during the 2019-20 school year by the eight Alliances. No PreK-20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.	`
    }
  },
  survey: {
    Q2_A_2: {
      "all": `Survey responses of all respondents on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  Nearly three-fourths (72%) of 86 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Fourth-five respondents from Alliances with 2 years of funding were more likely to report significant progress or achievement in this area (76%, compared with 68% for 41 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  More than three-fourths (79%) of 43 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Thirteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (85%, compared with 77% for 30 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM,All 6 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  Just over half (52%) of 25 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Eight respondents from Alliances with 2 years of funding were more likely to report significant progress or achievement in this area (72.5%, compared with 47% for 17 respondents from projects with 3 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a plan that addresses systemic barriers to broadening participation in STEM.  More than three-fourths (77.7%) of 9 respondents indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM. Six respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (83.3%, compared with 66.6% for 3 respondents from projects with 2 years of funding).`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a plan that addresses systemic barriers to broadening participation in STEM,Two-thirds (66.7%) of 3 respondents (from 2 and 3 years of funding) indicated that their project had developed (or had made significant progress in developing) a plan for addressing systemic barriers to broadening participation in STEM.`
    },
    Q3_A_1: {
      "all": `Survey responses of all respondents on Our project’s goals are informed by an assessment of the participant population’s needs.  Most (92%) of 83 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. Thirty-nine respondents from Alliances with 3 years of funding were more likely to somewhat or strongly agree with this statement (95%, compared with 89% for 44 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project’s goals are informed by an assessment of the participant population’s needs,Nearly all (95.3%) 42 respondents somewhat or strongly agreed that their project’s goals had been informed by an assessment of the needs of their participant population. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project’s goals are informed by an assessment of the participant population’s needs.  More than three-fourths (83.4%) of 6 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. All 3 respondents from Alliances with 3 years of funding somewhat or strongly agree with this statement, compared with 66.6% for 3 respondents from projects with 2 years of funding.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project’s goals are informed by an assessment of the participant population’s needs.  Most (85.4%) of 22 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. Fifteen respondents from Alliances with 3 years of funding were more likely to somewhat or strongly agree with this statement (85.7%, compared with 86.6% for 7 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project’s goals are informed by an assessment of the participant population’s needs.  Nine of 10 respondents indicated that their project’s goals had been informed by an assessment of the needs of their participant population. All 6 respondents from Alliances with 3 years of funding somewhat or strongly agreed with this statement, compared with 75% for 4 respondents from projects with 2 years of funding.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project’s goals are informed by an assessment of the participant population’s needs,All 3 respondents somewhat or strongly agreed that their project’s goals had been informed by an assessment of the needs of their participant population.`
    },
    Q4_A_1: {
      "all": `Survey responses of all respondents on All of our core partners are involved in the process of developing our project’s goals.  Most (93.8%) of 81 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals. Forty-two respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (59.5%, compared with 48.7% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners are involved in the process of developing our project’s goals.  Most (92.5%) of 40 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals. Twenty-seven respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (66.7%, compared with 61.5% for 13 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners are involved in the process of developing our project’s goals,All 6 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners are involved in the process of developing our project’s goals.  Nearly all (95.4%) 22 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals. All 7 respondents from Alliances with 2 years of funding somewhat or strongly agreed with this statement, compared with 93.3% for 15 respondents from projects with 3 years of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners are involved in the process of developing our project’s goals,All 10 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners are involved in the process of developing our project’s goals,Two of 3 respondents somewhat or strongly agreed that all of their core partners were involved in the process of developing their project’s goals.`
    },
    Q2_A_1: {
      "all": `Survey responses of all respondents on Our project has a plan that clearly specifies each partner’s role,More than three-fourths (81.2%) of 85 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role. There was no meaningful difference by year of funding.`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a plan that clearly specifies each partner’s role,Most (88.3%) of 43 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a plan that clearly specifies each partner’s role,All 6 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a plan that clearly specifies each partner’s role,Two-thirds (66.7%) of 24 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a plan that clearly specifies each partner’s role,Just over three-fourths (77.7%) of 9 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a plan that clearly specifies each partner’s role,Two of 3 respondents indicated that their project had developed (or had made significant progress in developing) a plan that clearly specified each partner’s role.`
    },
    Q2_A_3: {
      "all": `Survey responses of all respondents on Our project adds new partners to address a given need (e.g., to access crucial expertise and/or additional participants)".  More than half (59.8%) of 87 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need. Forty respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (65%, compared with 55.4% for 47 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project adds new partners to address a given need.  Nearly two-thirds (65.9%) of 44 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need. Thirteen respondents from Alliances with 3 years of funding reported significant progress or achievement in this area (76.9%, compared with 61.3% for those 31 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project adds new partners to address a given need,Three of 6 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project adds new partners to address a given need,Half (50%) of 24 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project adds new partners to address a given need,Six of 10 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project adds new partners to address a given need,Two of 3 respondents indicated that their project had added (or had made significant plans to add) new partners to address a given need.`
    },
    Q4_A_5: {
      "all": `Survey responses of all respondents on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals.  Most (85.4%) of 82 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project. Thirty-eight respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (52.6%, compared with 43.2% for 44 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,More than three-fourths (83.8%) of 43 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,Four of 5 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project.`,
      "Partner organization": `Survey responses of respondents in the partner organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,Most (90.5%) of 21 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,Eight of 10 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on The sum of our core and supporting partners represent the range of institutions needed to achieve our project’s goals,All 3 respondents somewhat or strongly agreed that the sum of their core and supporting partners represented the range of institutions needed to achieve the goals of their project.`
    },
    Q4_A_6: {
      "all": `Survey responses of all respondents on The sum of our core and supporting partners reflect the diversity of our participant population,Nearly three-fourths (71.5%) of 84 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population. There was no meaningful difference by year of funding.`,
      "Lead Organization": `Survey responses of respondents in the lead organization on The sum of our core and supporting partners reflect the diversity of our participant population,More than three-fourths (76.8%) of 43 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on The sum of our core and supporting partners reflect the diversity of our participant population,Three of 6 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population.`,
      "Partner organization": `Survey responses of respondents in the partner organization on The sum of our core and supporting partners reflect the diversity of our participant population,More than two-thirds (68.2%) of 22 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on The sum of our core and supporting partners reflect the diversity of our participant population,Six of 10 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on The sum of our core and supporting partners reflect the diversity of our participant population,All 3 respondents somewhat or strongly agreed that the sum of their core and supporting partners reflected the diversity of their participant population.`
    },
    Q5_A_1: {
      "all": `Survey responses of all respondents on My organization has clear goals for its contribution on the project.  More than three-fourths (84.2%) of 19 respondents somewhat or strongly agreed that their organization had clear goals for its contribution to the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (76.9%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization has clear goals for its contribution on the project.  More than three-fourths (84.2%) of 19 respondents somewhat or strongly agreed that their organization had clear goals for its contribution to the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (76.9%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization has clear goals for its contribution on the project,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q5_A_2: {
      "all": `Survey responses of all respondents on My organization is committed to implementing the project’s approach.  Most (94.7%) of 19 respondents somewhat or strongly agreed that their organization was committed to implementing their project’s approach. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization is committed to implementing the project’s approach.  Most (94.7%) of 19 respondents somewhat or strongly agreed that their organization was committed to implementing their project’s approach. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization is committed to implementing the project’s approach,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q5_A_3: {
      "all": `Survey responses of all respondents on My organization changes its activities to better align with the project’s approach.  Most (88.8%) of 18 respondents somewhat or strongly agreed that their organization had changed its activities to better align with the project’s approach. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (58.3%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization changes its activities to better align with the project’s approach.  Most (88.8%) of 18 respondents somewhat or strongly agreed that their organization had changed its activities to better align with the project’s approach. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (58.3%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization changes its activities to better align with the project’s approach,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q2_A_4: {
      "all": `Survey responses of all respondents on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods".  Just over three-fourths (76.5%) of 85 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods. Thirty-eight respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (84.2%, compared with 70.2% for 47 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods".  Three-fourths (75%) of 44 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods. Thirteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (84.7%, compared with 71% for 31 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". All 5 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". Three-fourths (75%) of 24 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods. Sixteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (87.6%, compared with 50% for 8 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". All 9 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has participatory processes to refine its measures, indicators, metrics, and/or data collection methods". All 3 respondents indicated that their project had (or have made significant progress toward developing) a participatory process to refine its measures, indicators, metrics, and/or data collection methods.`
    },
    Q2_A_5: {
      "all": `Survey responses of all respondents on Our project has the capacity to track progress across all partners (e.g., protocols, common metrics)". Nearly two-thirds (62%) of 82 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners. Thirty-nine respondents from Alliances with 3 years of funding were marginally more likely to report significant progress or achievement in this area (64%, compared with 60% for 43 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has the capacity to track progress across all partners,More than half (59.5%) of 42 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has the capacity to track progress across all partners,Four of 6 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has the capacity to track progress across all partners. Nearly three-fourths (72.7%) of 22 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners. Fifteen respondents from Alliances with 3 years of funding were marginally more likely to report significant progress or achievement in this area (86.7%, compared with 42.9% for 7 from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has the capacity to track progress across all partners,Six of 10 respondents indicated that their project had (or had made significant progress toward developing) the capacity to track progress across all partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has the capacity to track progress across all partners,Both respondents indicated that their project had made some progress toward or had not yet started developing the capacity to track progress across all partners.`
    },
    Q2_A_6: {
      "all": `Survey responses of all respondents on Our project uses data to make regular improvements. Nearly two-thirds (60.7%) of 84 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements. Thirty-eight respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (23.7%, compared with 19.6% for 46 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project uses data to make regular improvements. Just over two-thirds (68.2%) of 44 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements. Thirteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (38.5%, compared with 22.6% for 31 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project uses data to make regular improvements,All 6 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project uses data to make regular improvements. Nearly half (47.6%) of 21 respondents indicated that their project had achieved (or had made significant progress toward) using data to make regular improvements. Fourteen respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (21.4%, compared with zero of 7 projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project uses data to make regular improvements,Four of 10 respondents indicated that their project had made significant progress toward using data to make regular improvements.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project uses data to make regular improvements,One of 3 respondents indicated that their project had made significant progress toward using data to make regular improvements.`
    },
    Q4_A_2: {
      "all": `Survey responses of all respondents on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data. Most (88.5%) of 78 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. Thirty-nine respondents from Alliances with 3 years of funding were slightly more likely to strongly agree with this statement (41%, compared with 33.3% for 39 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data. Most (92.1%) of 38 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. Thirteen respondents from Alliances with 3 years of funding were slightly more likely to strongly agree with this statement (61.5%, compared with 36% for 25 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,Five of 6 (83.3%) respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. Six respondents from Alliances with 2 and 3 years of funding were equally likely (66.7%) to strongly agree with this statement.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,Most (85.7%) of 21 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,All 10 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners are involved in the process of making sense of findings that emerge from the project’s analysis of shared measurement data,One of 3 respondents somewhat or strongly agreed that all of their core partners were involved in the process of making sense of findings that emerged from their project’s analysis of their shared measurement data.`
    },
    Q5_A_4: {
      "all": `Survey responses of all respondents on My organization is involved in the process of making sense of data collected by the project. Nearly three-fourths (73.7%) of 19 respondents somewhat or strongly agreed that their organization was involved in the process of making sense of data collected by the Alliance. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (53.8%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization is involved in the process of making sense of data collected by the project. Nearly three-fourths (73.7%) of 19 respondents somewhat or strongly agreed that their organization was involved in the process of making sense of data collected by the Alliance. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (53.8%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization is involved in the process of making sense of data collected by the project,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q3_A_2: {
      "all": `Survey responses of all respondents on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders. Most (92.9%) of 85 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders. Forty-five respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (75.6%, compared with 62.5% for 40 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders. Nearly all (95.4%) 43 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 76.7% for 30 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders,All 6 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders. More than three-fourths (82.6%) of 23 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders. Sixteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (50%, compared with 42.9% for 7 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders,All 10 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project’s leadership structure leverages the collective knowledge of partners and other stakeholders,All 3 respondents somewhat or strongly agreed that their project’s leadership structure leveraged the collective knowledge of partners and other stakeholders.`
    },
    Q3_A_3: {
      "all": `Survey responses of all respondents on Our project leadership has structures in place to encourage full participation by all partners. Nearly all (95.3%) 85 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners. Forty-five respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (64.4%, compared with 42.5% for 40 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project leadership has structures in place to encourage full participation by all partners,All 43 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project leadership has structures in place to encourage full participation by all partners,All 6 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project leadership has structures in place to encourage full participation by all partners analysis of shared measurement data,More than three-fourths (82.6%) of 23 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project leadership has structures in place to encourage full participation by all partners,All 10 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project leadership has structures in place to encourage full participation by all partners,All 3 respondents somewhat or strongly agreed that their project’s leadership had structures in place to encourage full participation by all partners.`
    },
    Q3_A_4: {
      "all": `Survey responses of all respondents on Our project has internal procedures that minimize power imbalances among partners. Most (92.4%) of 79 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners. Forty-two respondents from Alliances with 2 years of funding were more likely to somewhat or strongly agree with this statement (97.6%, compared with 86.5% for 37 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has internal procedures that minimize power imbalances among partners,Nearly all (95%) of 40 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has internal procedures that minimize power imbalances among partners,More than three-fourths (83.4%) of 6 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has internal procedures that minimize power imbalances among partners,Most (86.4%) of 22 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has internal procedures that minimize power imbalances among partners,All 9 respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has internal procedures that minimize power imbalances among partners,Both respondents somewhat or strongly agreed that their project had internal procedures in place that minimize power imbalances among partners.`
    },
    Q3_A_5: {
      "all": `Survey responses of all respondents on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist. Most (91.6%) of 83 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist. Forty-four respondents from Alliances with 2 years of funding were more likely to somewhat or strongly agree with this statement (97.7%, compared with 84.6% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,Nearly all (97.7%) 42 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,More than three-fourths (83.4%) of 6 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,More than three-fourths (77.3%) of 22 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,All 10 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project leadership is willing to engage in frank and open discussions when areas of disagreement exist,All 3 respondents somewhat or strongly agreed that their project leadership was willing to engage in frank and open discussions when areas of disagreement exist.`
    },
    Q3_A_6: {
      "all": `Survey responses of all respondents on Our project leadership provides opportunities for building relationships across partners. Nearly all (95.3%) 84 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners. Forty-four respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (70.5%, compared with 57.5% for 40 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project leadership provides opportunities for building relationships across partners. All 42 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (84.6%, compared with 69% for 29 respondents from projects with 2 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project leadership provides opportunities for building relationships across partners,Five of 6 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project leadership provides opportunities for building relationships across partners,Most (86.9%) of 23 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project leadership provides opportunities for building relationships across partners,All 10 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project leadership provides opportunities for building relationships across partners,All 3 respondents somewhat or strongly agreed that their project leadership provided opportunities for building relationships across partners.`
    },
    Q3_A_7: {
      "all": `Survey responses of all respondents on Our project’s decision-making processes are transparent to those inside the project. Most (89.2%) of 83 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. Forty-four respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (59.1%, compared with 38.5% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project’s decision-making processes are transparent to those inside the project. Most (88.3%) of 43 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. Thirty respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (63.3%, compared with 46.2% for 13 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project’s decision-making processes are transparent to those inside the project. Two of 6 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. All 3 respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement, compared with 1 of 3 respondents from projects with 3 years of funding.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project’s decision-making processes are transparent to those inside the project. Most (90.9%) of 22 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project. Sixteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (43.8%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project’s decision-making processes are transparent to those inside the project,All 10 respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project’s decision-making processes are transparent to those inside the project,Both respondents somewhat or strongly agreed that their project’s decision-making processes were transparent to those inside the project.`
    },
    Q3_A_8: {
      "all": `Survey responses of all respondents on Our Project's decisions are informed by input from our participant population (e.g., through representation by members of the participant population on a steering committee)". More than three-fourths (83.3%) of 84 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population. Forty-five respondents from Alliances with 2 years of funding were slightly more likely to strongly agree with this statement (51.1%, compared with 46.2% for 39 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our Project's decisions are informed by input from our participant population. Most (93.1%) of 43 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population. Thirty respondents from Alliances with 2 years of funding were slightly more likely to strongly agree with this statement (63.3%, compared with 53.8% for 13 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our Project's decisions are informed by input from our participant population,Two of 3 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our Project's decisions are informed by input from our participant population,Nearly two-thirds (60.8%) of 23 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our Project's decisions are informed by input from our participant population,All 10 respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our Project's decisions are informed by input from our participant population,Both respondents somewhat or strongly agreed that their project’s decisions were informed by input from the participant population.`
    },
    Q4_A_3: {
      "all": `Survey responses of all respondents on All of our core partners collaborate with each other to align their actions. Most (87.6%) of 80 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions. Forty-one respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (53.7%, compared with 39% for 39 respondents from projects with 3 years of funding)"`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners collaborate with each other to align their actions,Most (92.3%) of 39 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners collaborate with each other to align their actions,Five of 6 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners collaborate with each other to align their actions,Most (86.4%) of 22 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners collaborate with each other to align their actions,Eight of 10 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners collaborate with each other to align their actions,Two of 3 respondents somewhat or strongly agreed that all core partners collaborated with each other to align their actions.`
    },
    Q4_A_4: {
      "all": `Survey responses of all respondents on All of our core partners regularly seek advice from one another (e.g., effective strategies for addressing a given challenge)". Most (91.3%) of 80 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another. Forty-two respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (47.6%, compared with 39.5% for 38 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on All of our core partners regularly seek advice from one another. Most (94.9%) of 39 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another. Twenty-seven respondents from Alliances with 2 years of funding were more likely to strongly agree with this statement (55.6%, compared with 41.7% for 12 respondents from projects with 3 years of funding).`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on All of our core partners regularly seek advice from one another,Five of 6 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another.`,
      "Partner organization": `Survey responses of respondents in the partner organization on All of our core partners regularly seek advice from one another,More than three-fourths (81.9%) of 22 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on All of our core partners regularly seek advice from one another,All 10 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on All of our core partners regularly seek advice from one another,All 3 respondents somewhat or strongly agreed that all core partners regularly seek advice from one another.`
    },
    Q5_A_5: {
      "all": `Survey responses of all respondents on My organization shares its challenges, setbacks, and lessons learned with other partners on the project". Most (89.4%) of 19 respondents somewhat or strongly agreed that their organizations shared their challenges, setbacks, and lessons learned with other partners on the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (46.2%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project". Most (89.4%) of 19 respondents somewhat or strongly agreed that their organizations shared their challenges, setbacks, and lessons learned with other partners on the project. Thirteen respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (46.2%, compared with 16.7% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization shares its challenges, setbacks, and lessons learned with other partners on the project",This question is only asked of respondents who are associated with a partner organization.`
    },
    Q5_A_6: {
      "all": `Survey responses of all respondents on My organization seeks advice from other partners on the project (e.g., effective strategies for addressing a given challenge)". Most (94.4%) of 18 respondents somewhat or strongly agreed that their organization seeks advice from other partners on the project. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (50%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Partner organization": `Survey responses of respondents in the partner organization on My organization seeks advice from other partners on the project. Most (94.4%) of 18 respondents somewhat or strongly agreed that their organization seeks advice from other partners on the project. Twelve respondents from Alliances with 3 years of funding were more likely to strongly agree with this statement (50%, compared with 33.3% for 6 respondents from projects with 2 years of funding).`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on My organization seeks advice from other partners on the project,This question is only asked of respondents who are associated with a partner organization.`
    },
    Q2_A_7: {
      "all": `Survey responses of all respondents on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM. Nearly three-fourths (70.1%) of 87 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM. Forty-one respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (80.5%, compared with 60.9% for 46 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Nearly two-thirds (62.8%) of 43 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,All 6 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Just over three-fourths (76%) of 25 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Seven of 10 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project contributes to the field’s knowledge base about effective strategies for broadening participation in STEM,Two of 3 respondents indicated that their project had contributed (or had made significant progress toward contributing) to the field’s knowledge base about effective strategies for broadening participation in STEM.`
    },
    Q2_A_8: {
      "all": `Survey responses of all respondents on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period. Under one-third (30.4%) of 79 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period. Forty respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (32.5%, compared with 28.2% for 39 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,One-third (33.3%) of 36 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,Under one-fifth (16.7%) of 6 respondents indicated that their project had a written plan that outlined a strategy for sustaining activities beyond the current award period.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,One-fifth (20.9%) of 24 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,Five of 10 respondents indicated that their project had (or had made significant progress toward developing) a written plan that outlined a strategy for sustaining activities beyond the current award period.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a written plan that outlines a strategy for sustaining activities beyond the current award period,One of 3 respondents indicated that their project had made significant progress toward developing a written plan that outlined a strategy for sustaining activities beyond the current award period.`
    },
    Q2_A_9: {
      "all": `Survey responses of all respondents on Our project has secured funding beyond the current award period. Just over one-tenth (12.1%) of 66 respondents indicated that their project had secured (or had made significant progress toward securing) funding beyond the current award period. Thirty-two respondents from Alliances with 3 years of funding were more likely to report significant progress or achievement in this area (15.6%, compared with 8.8% for 34 respondents from projects with 2 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has secured funding beyond the current award period,Just over one-tenth (12.2%) of 33 respondents indicated that their project had secured (or had made significant progress toward securing) funding beyond the current award period. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has secured funding beyond the current award period,More than one-third (40%) of 5 respondents indicated that their project had made some progress toward securing funding beyond the current award period.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has secured funding beyond the current award period,Nearly one-fifth (17.6%) of 17 respondents indicated that their project had made significant progress toward securing funding beyond the current award period.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has secured funding beyond the current award period,One of 10 respondents indicated that their project had made significant progress toward securing funding beyond the current award period.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has secured funding beyond the current award period,The 1 respondent indicated that their project had not yet started securing funding beyond the current award period.`
    },
    Q3_A_9: {
      "all": `Survey responses of all respondents on Our project has a strategic vision of what activities will be sustained beyond the current award period. Nearly three-fourths (72.8%) of 77 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period. Forty respondents from Alliances with 2 years of funding were more likely to somewhat or strongly agree with this statement (82.5%, compared with 62.1% for 37 respondents from projects with 3 years of funding).`,
      "Lead Organization": `Survey responses of respondents in the lead organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,More than three-fourths (78.4%) of 37 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period. There was no meaningful difference by year of funding.`,
      "Evaluation organization": `Survey responses of respondents in the evaluation organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,Three of 5 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period.`,
      "Partner organization": `Survey responses of respondents in the partner organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,Nearly one-third (59.1%) of 22 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period. There was no meaningful difference by year of funding.`,
      "Backbone organization": `Survey responses of respondents in the backbone organization on Our project has a strategic vision of what activities will be sustained beyond the current award period,Nine of 10 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period.`,
      "Respondent participates as an individual and does not belong to an organization affiliated with the project": `Survey responses of respondents who do not belong to an organization affiliated with the project on Our project has a strategic vision of what activities will be sustained beyond the current award period,One of 3 respondents somewhat or strongly agreed that their project had a strategic vision of what activities would be sustained beyond the current award period.`
    }
  }
};

function filterNotCollected(data, dataSet) {
  return data.filter(function (d) {
    return d[dataSet] !== "Not collected";
  });
}

function setChartContainerHeight(containerID, ratio) {
  var container = d3.select("#" + containerID),
      width = container.node().clientWidth;
  container.style("height", width * ratio + "px");
}

function setChartContainerHeightMobile(containerID, ratio) {
  var height = window.innerHeight * .85;
  d3.select("#" + containerID).style("height", height + "px");
}

let arc = (r, sign) => r ? `a${r * sign[0]},${r * sign[1]} 0 0 1 ${r * sign[2]},${r * sign[3]}` : "";

function roundedRect(x, y, width, height, r) {
  r = [Math.min(r[0], height, width), Math.min(r[1], height, width), Math.min(r[2], height, width), Math.min(r[3], height, width)];
  return `M${x + r[0]},${y}h${width - r[0] - r[1]}${arc(r[1], [1, 1, 1, 1])}v${height - r[1] - r[2]}${arc(r[2], [1, 1, -1, 1])}h${-width + r[2] + r[3]}${arc(r[3], [1, 1, -1, -1])}v${-height + r[3] + r[0]}${arc(r[0], [1, 1, 1, -1])}z`;
}

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        // ems
    y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

function mobileWrap(text, width, barWidth) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1,
        // ems
    y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        ++lineNumber;
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", lineNumber ? lineHeight + "em" : "0em").text(word);
      }
    }

    if (lineNumber) {
      var textHeight = text.node().getBBox().height,
          xStartVal = +text.node().parentElement.getAttribute('transform').split(",")[1].split(")")[0],
          barTop = xStartVal - barWidth / 2,
          offset = (barWidth - textHeight) / 2,
          xEndVal = barTop + offset;
      text.node().parentElement.setAttribute("transform", "translate(0," + xEndVal + ")");
      text.node().parentElement.setAttribute("dominant-baseline", "hanging");
    }
  });
}

function noDataWrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1,
        // ems
    y = text.attr("y"),
        x = text.attr("x"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", 0);

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word]; //   console.log("try this", lineNumber, lineHeight, dy);

        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * 25).text(word);
      }
    }
  });
}

window.xScales = {};
window.yScales = {};

var buildBarChart = (containerID, data) => {
  var container = d3.select("#" + containerID),
      width = container.node().clientWidth,
      height = container.node().clientHeight,
      isStudentChart = container.attr("class").indexOf('educators') === -1;
  var margin = {
    top: 40,
    right: 0,
    bottom: 60,
    left: 0
  },
      innerWidth = width - chartMargin.left - chartMargin.right,
      innerHeight = height - chartMargin.top - chartMargin.bottom;
  var xScale = d3.scaleBand().domain(data.map(d => d.label)).range([margin.left, innerWidth - margin.right]).padding(0.2);
  window.xScales[containerID] = xScale;
  var yScale = d3.scaleLinear().domain([0, d3.max(data, function (d) {
    return d.percentage;
  })]) //.nice()
  .range([innerHeight, 0]);
  window.yScales[containerID] = yScale;
  var tip = d3.tip().attr("class", "d3-tip").html((EVENT, d) => {
    return d.value;
  });
  tooltips[containerID] = tip;
  var svg = container.append('svg').attr("width", width).attr("height", height).attr("role", "graphics-datachart").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.call(tip);
  var defs = svg.append("defs"),
      greenGrad = defs.append('linearGradient').attr("id", containerID + "-green-gradient").attr("gradientTransform", "rotate(90)"),
      blueGrad = defs.append('linearGradient').attr("id", containerID + "-blue-gradient").attr("gradientTransform", "rotate(90)");
  blueGrad.append("stop").attr("offset", "5%").attr("stop-color", "#4FC7F3");
  blueGrad.append("stop").attr("offset", "95%").attr("stop-color", "#3CAFE3");
  greenGrad.append("stop").attr("offset", "5%").attr("stop-color", "#A9E25D");
  greenGrad.append("stop").attr("offset", "95%").attr("stop-color", "#A2CD6A");
  var rx = 5,
      ry = 5;
  var gradientId = "url(#" + containerID + (isStudentChart ? "-blue-gradient" : "-green-gradient") + ")";
  var bars = svg.selectAll(".bar").data(data).enter() //.append("g").attr("class", "bar-g");
  // bars
  .append('path').attr("class", "bar").attr("fill", gradientId).attr("d", d => roundedRect(xScale(d.label), // yScale(d.percentage),  //commented out for rendering zero value bars to animate to actual values
  yScale(0.1), xScale.bandwidth(), // yScale(0) - yScale(d.percentage),  //commented out for rendering zero value bars to animate to actual values
  yScale(0) - yScale(0.1), // 0,
  [10, 10, 0, 0]
  /* corner values of bar paths */
  )).on('mouseover', tip.show).on('mouseout', tip.hide);
  svg.selectAll(".bar-label").data(data).enter().append("text").text(function (d) {
    // return d.percentage + "%";
    return percentageText(d.percentage);
  }).attr("class", "bar-label").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.percentage) - 23;
  }) // .attr("font-family" , "sans-serif")
  .attr("text-anchor", "middle").style("opacity", 0);
  svg.selectAll(".bar-label-triangle").data(data).enter().append('path').attr("class", "bar-label-triangle").attr("d", d3.symbol().type(d3.symbolTriangle).size(80)).attr("fill", "#FBD431").attr("transform", d => {
    return "translate(" + (xScale(d.label) + xScale.bandwidth() / 2) + "," + (yScale(d.percentage) - 14) + ") rotate(60,0,0)";
  }).style("opacity", 0);

  var xAxis = g => g.attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(xScale).tickFormat(label => label).tickSize(0).tickPadding(15));

  svg.append("g").attr("class", "x axis").attr("transform", `translate(0,${innerHeight})`).call(xAxis).selectAll(".tick text").call(wrap, xScale.bandwidth());
  svg.append("g").append("text").attr("class", "no-data-text").style("opacity", 0).text(function () {
    if (isStudentChart) {
      return "No PreK—20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.";
    } else {
      return "No educators were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.";
    }
  }).attr("x", "50%").attr("y", innerHeight * .25).call(noDataWrap, 400);
  setTimeout(() => {
    updatechart(containerID, data);
  }, 750);
};

var updatechart = (containerID, data) => {
  var container = d3.select("#" + containerID),
      svg = container.select('svg g'),
      width = container.node().clientWidth,
      height = container.node().clientHeight,
      margin = {
    top: 40,
    right: 0,
    bottom: 60,
    left: 0
  },
      isStudentChart = container.attr("class").indexOf('educators') === -1;
  gradientId = "url(#" + containerID + (isStudentChart ? "-blue-gradient" : "-green-gradient") + ")", // tip = d3.tip().attr("class", "d3-tip").html((EVENT, d)=>{ return d.value; });
  tip = tooltips[containerID];
  var barGs = container.selectAll('.bar-g'),
      startData = barGs.data(),
      startLen = barGs._groups[0].length;
  var xScale = window.xScales[containerID],
      yScale = window.yScales[containerID];
  var maxPercentage = d3.max(data, function (d) {
    return d.percentage;
  }); //TODO - Better bar number change??

  xScale.domain(data.map(d => d.label));

  var xAxis = g => g // .attr("transform", `translate(0,${innerHeight})`)
  .call(d3.axisBottom(xScale).tickFormat(label => label).tickSize(0).tickPadding(15)).call(g => g.selectAll('.tick text').style("opacity", 0));

  var theAxis = container.select('.x.axis'); // console.log("theAxis yo", theAxis, xAxis);

  theAxis.call(xAxis).selectAll(".tick text").call(wrap, xScale.bandwidth()); // .call(g => g.selectAll('.tick text').style("opacity", 0));

  theAxis.selectAll(".tick text").transition().delay(1000).duration(250).style("opacity", 1).attr("opacity", 1); // // Remove no data text transitions
  // if (maxPercentage > 0){
  //     yScale.domain([0, maxPercentage]).nice();
  //     container.select(".no-data-text")
  //         .transition()
  //             .duration(200)
  //             .style("opacity", 0);
  // }
  // var bars = barGs.select(".bar");

  var bars = svg.selectAll(".bar");
  var barLabels = svg.selectAll(".bar-label");
  var barTriangles = svg.selectAll(".bar-label-triangle"); //TODO TODO TODO - fix enter exit with new no G structure bars, text, triangles
  // bars.data(data, function(d){ return d; })

  bars.data(data) // .enter()
  // .append('path')
  //     .attr("class", "bar new")
  //     .attr("fill", gradientId)
  //     .attr("d", d => roundedRect(
  //         xScale(d.label),
  //         // yScale(d.percentage),  //commented out for rendering zero value bars to animate to actual values
  //         yScale(0.1),
  //         xScale.bandwidth(),
  //         // yScale(0) - yScale(d.percentage),  //commented out for rendering zero value bars to animate to actual values
  //         yScale(0) - yScale(0.1),
  //         // 0,
  //         [10, 10, 0, 0]   /* corner values of bar paths */
  //     ))
  //     .on('mouseover', tip.show)
  //     .on('mouseout', tip.hide)
  .exit().transition().delay(100).duration(250).style("opacity", 0).remove();
  barLabels.transition() // .delay(100)
  .duration(250).style("opacity", 0);
  barLabels.data(data).exit().remove();
  barTriangles.transition() // .delay(100)
  .duration(250).style("opacity", 0);
  barTriangles.data(data).exit().remove();
  setTimeout(function () {
    var barLabels = svg.selectAll(".bar-label");
    var barTriangles = svg.selectAll(".bar-label-triangle");
    barLabels //.selectAll(".bar-label")
    .data(data).transition() //     .duration(100)
    //     .style("opacity", 0)
    // .on("end", function(){
    //     d3.select(this)
    .text(function (d) {
      // return d.percentage + "%";
      return percentageText(d.percentage);
    }).attr("y", function (d) {
      return yScale(d.percentage) - 18;
    }).attr("x", function (d) {
      return xScale(d.label) + xScale.bandwidth() / 2;
    }); // });
    // container.selectAll(".bar-label-triangle")

    barTriangles.data(data).transition().duration(100).style("opacity", 0).on("end", function () {
      d3.select(this).attr("transform", d => {
        return "translate(" + (xScale(d.label) + xScale.bandwidth() / 2) + "," + (yScale(d.percentage) - 10) + ") rotate(60,0,0)";
      });
    });
    svg.selectAll(".bar").data(data).transition().delay(100).duration(800).attr("d", d => roundedRect(xScale(d.label), yScale(d.percentage > 0 ? d.percentage : 0.001), //roundedRect paths don't like zero values on transitions
    xScale.bandwidth(), yScale(0) - yScale(d.percentage > 0 ? d.percentage : 0.001), //roundedRect paths don't like zero values on transitions
    [10, 10, 0, 0]
    /* corner values of bar paths */
    ));
    barLabels //.selectAll(".bar-label")
    .transition().delay(1000).duration(150).style("opacity", 1); // container.selectAll(".bar-label-triangle")

    barTriangles.transition().delay(1000).duration(150).style("opacity", 1);
  }, 300);
  setTimeout(function () {
    svg.selectAll(".bar").data(data).enter().append('path').attr("class", "bar").attr("fill", gradientId).attr("d", d => roundedRect(xScale(d.label), // yScale(d.percentage),  //commented out for rendering zero value bars to animate to actual values
    yScale(0.1), xScale.bandwidth(), // yScale(0) - yScale(d.percentage),  //commented out for rendering zero value bars to animate to actual values
    yScale(0) - yScale(0.1), // 0,
    [10, 10, 0, 0]
    /* corner values of bar paths */
    )).on('mouseover', tip.show).on('mouseout', tip.hide).transition().delay(100).duration(800).attr("d", d => roundedRect(xScale(d.label), yScale(d.percentage > 0 ? d.percentage : 0.001), //roundedRect paths don't like zero values on transitions
    xScale.bandwidth(), yScale(0) - yScale(d.percentage > 0 ? d.percentage : 0.001), //roundedRect paths don't like zero values on transitions
    [10, 10, 0, 0]
    /* corner values of bar paths */
    ));
    svg.selectAll(".bar-label").data(data).enter().append("text").text(function (d) {
      // return d.percentage + "%";
      return percentageText(d.percentage);
    }).attr("class", "bar-label").attr("x", function (d) {
      return xScale(d.label) + xScale.bandwidth() / 2;
    }).attr("y", function (d) {
      return yScale(d.percentage) - 23;
    }) // .attr("font-family" , "sans-serif")
    .attr("text-anchor", "middle").style("opacity", 0).transition().delay(800).duration(200).style("opacity", 1);
    svg.selectAll(".bar-label-triangle").data(data).enter().append("path").attr("class", "bar-label-triangle").attr("d", d3.symbol().type(d3.symbolTriangle).size(80)).attr("fill", "#FBD431").attr("transform", d => {
      return "translate(" + (xScale(d.label) + xScale.bandwidth() / 2) + "," + (yScale(d.percentage) - 14) + ") rotate(60,0,0)";
    }).style("opacity", 0).transition().delay(800).duration(200).style("opacity", 1);
  }, 800); // // remove no data text transitions
  //     if (maxPercentage === 0){
  //         container.select(".no-data-text")
  //             .transition()
  //                 .delay(1200)
  //                 .duration(250)
  //                 .style("opacity", 1);
  //     }
};

var buildBarChartMobile = (containerID, data) => {
  var container = d3.select("#" + containerID),
      width = container.node().clientWidth,
      height = container.node().clientHeight,
      isStudentChart = container.attr("class").indexOf('educators') === -1;
  var margin = marginsBarMobile,
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
  var yScale = d3.scaleBand().domain(data.map(d => d.label)).range([0, innerHeight]).padding(0.2);
  window.yScales[containerID] = yScale;
  var xScale = d3.scaleLinear().domain([0, d3.max(data, function (d) {
    return d.percentage;
  })]) //.nice()
  .range([0, innerWidth]);
  window.xScales[containerID] = xScale;
  var tip = d3.tip().attr("class", "d3-tip").html((EVENT, d) => {
    return d.value;
  });
  tooltips[containerID] = tip;
  var svg = container.append('svg').attr("width", width).attr("height", height).attr("role", "graphics-datachart").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //TODO - fix transform

  svg.call(tip);
  var defs = svg.append("defs"),
      greenGrad = defs.append('linearGradient').attr("id", containerID + "-green-gradient").attr("gradientTransform", "rotate(90)"),
      blueGrad = defs.append('linearGradient').attr("id", containerID + "-blue-gradient").attr("gradientTransform", "rotate(90)"); //TODO - verify gradients transform

  blueGrad.append("stop").attr("offset", "5%").attr("stop-color", "#4FC7F3");
  blueGrad.append("stop").attr("offset", "95%").attr("stop-color", "#3CAFE3");
  greenGrad.append("stop").attr("offset", "5%").attr("stop-color", "#A9E25D");
  greenGrad.append("stop").attr("offset", "95%").attr("stop-color", "#A2CD6A");
  var rx = 5,
      ry = 5;
  var gradientId = "url(#" + containerID + (isStudentChart ? "-blue-gradient" : "-green-gradient") + ")";
  var bars = svg.selectAll(".bar").data(data).enter() //.append("g");
  // bars
  .append('path').attr("class", "bar").attr("fill", gradientId).attr("d", d => roundedRect(xScale(0), yScale(d.label), xScale(0.1) - xScale(0), // xScale( (d.percentage > 0 ? d.percentage : 0.001) ),
  yScale.bandwidth(), [0, 10, 10, 0]
  /* corner values of bar paths */
  )).on('mouseover', tip.show).on('mouseout', tip.hide);
  svg.selectAll(".bar-label").data(data).enter().append("text").text(function (d) {
    // return d.percentage + "%";
    return percentageText(d.percentage);
  }).attr("class", "bar-label").attr("y", function (d) {
    return yScale(d.label) + yScale.bandwidth() / 2;
  }).attr("x", function (d) {
    return xScale(d.percentage) + 18;
  }) // .attr("font-family" , "sans-serif")
  // .attr("text-anchor", "middle")
  .attr("dominant-baseline", "central").style("opacity", 0);
  svg.selectAll(".bar-label-triangle").data(data).enter().append('path').attr("class", "bar-label-triangle").attr("d", d3.symbol().type(d3.symbolTriangle).size(80)).attr("fill", "#FBD431").attr("transform", d => {
    return "translate(" + (xScale(d.percentage) + 10) + "," + (yScale(d.label) + yScale.bandwidth() / 2) + ") rotate(30,0,0)";
  }).style("opacity", 0);

  var offset = 5,
      yAxis = g => g.attr("transform", `translate(${-offset}, 0)`).call(d3.axisLeft(yScale).tickFormat(label => label).tickSize(0).tickPadding(15).offset(offset)); //TODO - very transform on axis, above and below


  svg.append("g").attr("class", "y axis") // .attr("transform", `translate(${margin.left}, 0)`)
  .call(yAxis).selectAll(".tick text").call(mobileWrap, margin.left * .98, yScale.bandwidth());
  var wrapWidth = xScale.range()[1];
  svg.append("g").append("text").attr("class", "no-data-text").style("opacity", 0).text(function () {
    if (isStudentChart) {
      return "No PreK—20 students were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.";
    } else {
      return "No educators were reached at this level by the STEM BP projects that reported participant data for the 2019-20 school year.";
    }
  }).attr("x", "45%").attr("y", innerHeight * .25) // .call(noDataWrap, 400);
  .call(noDataWrap, wrapWidth); //TODO - x and y values

  setTimeout(() => {
    updateBarChartMobile(containerID, data);
  }, 750);
};

var updateBarChartMobile = (containerID, data) => {
  var container = d3.select("#" + containerID),
      svg = container.select('svg g'),
      width = container.node().clientWidth,
      height = container.node().clientHeight,
      margin = marginsBarMobile,
      isStudentChart = container.attr("class").indexOf('educators') === -1;
  gradientId = "url(#" + containerID + (isStudentChart ? "-blue-gradient" : "-green-gradient") + ")", // tip = d3.tip().attr("class", "d3-tip").html((EVENT, d)=>{ return d.value; });
  tip = tooltips[containerID];
  var bars = container.selectAll('.bar'),
      startData = bars.data();
  var xScale = window.xScales[containerID],
      yScale = window.yScales[containerID];
  var maxPercentage = d3.max(data, function (d) {
    return d.percentage;
  });
  yScale.domain(data.map(d => d.label));

  var offset = 5,
      yAxis = g => g.attr("transform", `translate(${-offset}, 0)`).call(d3.axisLeft(yScale).tickFormat(label => label).tickSize(0).tickPadding(15).offset(offset));

  var theAxis = container.selectAll('.y.axis');
  theAxis.call(yAxis).selectAll(".tick text").call(mobileWrap, margin.left * .98, yScale.bandwidth());
  theAxis.selectAll(".tick text").transition().delay(1000).duration(250).style("opacity", 1).attr("opacity", 1);

  if (maxPercentage > 0) {
    xScale.domain([0, maxPercentage]).nice();
  } // // remove no data text transition
  // if (maxPercentage > 0){
  //     container.select(".no-data-text")
  //         .transition()
  //             .duration(200)
  //             .style("opacity", 0);
  // }


  var bars = svg.selectAll(".bar");
  var barLabels = svg.selectAll(".bar-label");
  var barTriangles = svg.selectAll(".bar-label-triangle");
  bars.data(data).exit().transition().delay(100).duration(250).style("opacity", 0).remove();
  barLabels.transition() // .delay(100)
  .duration(250).style("opacity", 0);
  barLabels.data(data).exit().remove();
  barTriangles.transition() // .delay(100)
  .duration(250).style("opacity", 0);
  barTriangles.data(data).exit().remove();
  setTimeout(function () {
    var barLabels = svg.selectAll(".bar-label");
    var barTriangles = svg.selectAll(".bar-label-triangle");
    barLabels.data(data).transition().text(function (d) {
      return percentageText(d.percentage);
    }).attr("y", function (d) {
      return yScale(d.label) + yScale.bandwidth() / 2;
    }).attr("x", function (d) {
      return xScale(d.percentage) + 18;
    });
    barTriangles.data(data).transition().duration(100).style("opacity", 0).on("end", function () {
      d3.select(this).attr("transform", d => {
        return "translate(" + (xScale(d.percentage) + 10) + "," + (yScale(d.label) + yScale.bandwidth() / 2) + ") rotate(30,0,0)";
      });
    });
    svg.selectAll(".bar").data(data).transition().delay(100).duration(800).attr("d", d => roundedRect(xScale(0), //roundedRect paths don't like zero values on transitions
    yScale(d.label), xScale(d.percentage > 0 ? d.percentage : 0.001), //roundedRect paths don't like zero values on transitions
    yScale.bandwidth(), [0, 10, 10, 0]
    /* corner values of bar paths */
    ));
    barLabels //.selectAll(".bar-label")
    .transition().delay(1000).duration(150).style("opacity", 1); // container.selectAll(".bar-label-triangle")

    barTriangles.transition().delay(1000).duration(150).style("opacity", 1);
  }, 300);
  setTimeout(function () {
    svg.selectAll(".bar").data(data).enter().append('path').attr("class", "bar").attr("fill", gradientId).attr("d", d => roundedRect(xScale(0), yScale(d.label), xScale(0.1) - xScale(0), // xScale( (d.percentage > 0 ? d.percentage : 0.001) ),
    yScale.bandwidth(), [0, 10, 10, 0]
    /* corner values of bar paths */
    )).on('mouseover', tip.show).on('mouseout', tip.hide).transition().delay(100).duration(800).attr("d", d => roundedRect(xScale(0), //roundedRect paths don't like zero values on transitions
    yScale(d.label), xScale(d.percentage > 0 ? d.percentage : 0.001), //roundedRect paths don't like zero values on transitions
    yScale.bandwidth(), [0, 10, 10, 0]
    /* corner values of bar paths */
    ));
    svg.selectAll(".bar-label").data(data).enter().append("text").text(function (d) {
      return percentageText(d.percentage);
    }).attr("class", "bar-label").attr("y", function (d) {
      return yScale(d.label) + yScale.bandwidth() / 2;
    }).attr("x", function (d) {
      return xScale(d.percentage) + 18;
    }) // .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central").style("opacity", 0).transition().delay(800).duration(200).style("opacity", 1);
    svg.selectAll(".bar-label-triangle").data(data).enter().append("path").attr("class", "bar-label-triangle").attr("d", d3.symbol().type(d3.symbolTriangle).size(80)).attr("fill", "#FBD431").attr("transform", d => {
      return "translate(" + (xScale(d.percentage) + 10) + "," + (yScale(d.label) + yScale.bandwidth() / 2) + ") rotate(30,0,0)";
    }).style("opacity", 0).transition().delay(800).duration(200).style("opacity", 1);
  }, 800); // // remove no data text transition
  //     if (maxPercentage === 0){
  //         container.select(".no-data-text")
  //             .transition()
  //                 .delay(1200)
  //                 .duration(250)
  //                 .style("opacity", 1);
  //     }
};

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function populateTable(group, dataSet, data) {
  var total = 0;
  data.forEach(function (d) {
    total += d.value;
    d.value = numberWithCommas(d.value);
  });
  total = numberWithCommas(total);
  var string = dataSet;
  var tableData = {
    data: data,
    dataSet: string.charAt(0).toUpperCase() + string.slice(1),
    total: total
  };
  var source = $("#students-table-template").html();
  var template = Handlebars.compile(source);
  var html = template(tableData);
  var containerSelector = "#" + group + "-" + dataSet + "-table";
  $(containerSelector).html(html);
}

function changeBarChartAltText(group, dataSet, filterVal) {
  var chartSelector = "#" + group + "-" + dataSet + "-bar-chart svg",
      checked = document.getElementById(group + "-" + dataSet + "-notcollected").checked,
      textObj;

  if (checked) {
    textObj = altText2;
  } else {
    textObj = altText;
  } // d3.select(chartSelector).attr("alt", textObj[group][dataSet][filterVal]);


  d3.select(chartSelector).attr("aria-label", textObj[group][dataSet][filterVal]);
}

function changeStackedChartAltText(chartID, filterVal) {
  var chartSelector = "#" + chartID + " svg"; // d3.select(chartSelector).attr("alt", altText.survey[chartID][filterVal]);

  d3.select(chartSelector).attr("aria-label", altText.survey[chartID][filterVal]);
}

function processBarchartData(data, dataType) {
  var tempData = {},
      total = 0,
      processedData = [],
      sortedData = [],
      chartValueOrders = {
    gender: ["Male", "Female", "Non-binary", "Other", "Not provided by respondent", "Not collected by project"],
    race: ["American Indian or Alaska Native ", "Asian or Asian American", "Black or African American", "Middle Eastern or Northern African ", "Native Hawaiian or Other Pacific Islander", "White", "Other", "Multi Racial", "Collected but not recognized", "Not provided by respondent", "Not collected by project"],
    ethnicity: ["Hispanic or Latino/a/x", "Not Hispanic or Latino/a/x", "Not provided by respondent", "Not collected by project"]
  };
  data.forEach(d => {
    if (tempData[d[dataType]] === undefined) {
      tempData[d[dataType]] = d.count;
    } else {
      tempData[d[dataType]] += d.count;
    }

    total += d.count;
  });
  var keys = Object.keys(tempData);
  console.log("keys", keys);
  keys.forEach(d => {
    var percentage;

    if (total > 0) {
      percentage = Math.round10(tempData[d] / total * 100, -1);
    } else {
      percentage = 0;
    }

    var datum = {
      label: d,
      value: tempData[d],
      percentage: percentage
    };

    if (d === "Non binary") {
      datum.label = "Non-binary";
    }

    if (d === "Not Collected" || d === "Not collected") {
      datum.label = "Not collected by project";
    }

    processedData.push(datum);
  });
  chartValueOrders[dataType].forEach(orderString => {
    if (keys.indexOf(orderString) > -1) {
      var obj = processedData.filter(d => {
        return d.label === orderString;
      })[0];
      sortedData.push(obj);
    }
  });
  return sortedData;
}

function percentageText(num) {
  return num % 1 === 0 ? num + ".0%" : num + "%";
}

function buildStackedChart(containerID, data) {
  var container = d3.select("#" + containerID),
      width = container.node().clientWidth,
      height = container.node().clientHeight;
  var margin = {
    top: 10,
    right: 0,
    bottom: 60,
    left: 0,
    nSpace: 40
  },
      innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom - margin.nSpace;
  var xScale = d3.scaleBand() // .domain(d3.range(data1.length))
  .domain(data.map(d => d.label)).range([margin.left, innerWidth - margin.right]).padding(0.2);
  var minV = d3.min(data, function (d) {
    return d.val4;
  }),
      maxV = d3.max(data, function (d) {
    return d.val1;
  }),
      absV = Math.max(Math.abs(minV), maxV),
      domainArr = [-absV, absV];
  var yScale = d3.scaleLinear() //TODO - domain - [larges absolute value negative, largest absolute value]
  .domain([d3.min(data, function (d) {
    return d.val4;
  }), d3.max(data, function (d) {
    return d.val1;
  })] //domainArr            
  ) //.nice()
  .range([innerHeight, 0]);
  window.xScales[containerID] = xScale;
  window.yScales[containerID] = yScale;
  var tip1 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `Strongly agree<br><br>Count: ${d.a1}<br>Percent: ${d.percentage1}%`;
  }),
      tip2 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `Somewhat agree<br><br>Count: ${d.a2}<br>Percent: ${d.percentage2}%`;
  }),
      tip3 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `Somewhat disagree<br><br>Count: ${d.a3}<br>Percent: ${d.percentage3}%`;
  }),
      tip4 = d3.tip().attr('class', 'd3-tip').direction("s").html((EVENT, d) => {
    return `Strongly disagree<br><br>Count: ${d.a4}<br>Percent: ${d.percentage4}%`;
  });
  var svg = container.append('svg').attr("width", width).attr("height", height).attr("role", "graphics-datachart").attr("tabindex", "0").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.call(tip1);
  svg.call(tip2);
  svg.call(tip3);
  svg.call(tip4);
  var rx = 5,
      ry = 5; //Order of declarations matter

  var bars1 = svg.selectAll(".bar1").data(data).enter().append("g");
  var bars4 = svg.selectAll(".bar4").data(data).enter().append("g");
  var bars2 = svg.selectAll(".bar2").data(data).enter().append("g");
  var bars3 = svg.selectAll(".bar3").data(data).enter().append("g");
  var nText = svg.selectAll("g.n-text-g").data(data).enter().append("g").attr("class", "n-text-g").append("text").attr("class", "n-text").text(function (d) {
    return "(n=" + d.total + ")";
  }).attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", innerHeight + 10).attr("font-size", "14px").attr("text-anchor", "middle");
  bars1.append('path').attr("class", "bar top").attr("d", d => {
    // var corners = (d.a2 === 0 && d.a3 === 0 && d.a4 === 0) ? [10, 10, 10, 10] : [10, 10, 0, 0];
    var corners = [10, 10, 0, 0];
    return roundedRect(xScale(d.label), yScale(d.val1), xScale.bandwidth(), yScale(0) - yScale(d.val1), // [10, 10, 0, 0]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip1.show).on("mouseout", tip1.hide); // .on("mouseover", (a,b,c,d)=>{
  //     console.log("hover", a, b, c, d);
  // })
  // .on("mouseout", tip1.hide)

  bars2.append('path').attr("class", "bar upper").attr("d", d => {
    var corners = d.a1 === 0 ? [10, 10, 0, 0] : [0, 0, 0, 0];
    return roundedRect(xScale(d.label), yScale(d.val2), xScale.bandwidth(), yScale(0) - yScale(d.val2), // [0, 0, 0, 0]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip2.show).on("mouseout", tip2.hide);
  bars3.append('path').attr("class", "bar lower").attr("d", d => {
    var corners = d.a4 === 0 ? [0, 0, 10, 10] : [0, 0, 0, 0];
    return roundedRect(xScale(d.label), // yScale(d.val3) - yScale(0),
    yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val3), // yScale(d.val3),
    // yScale(0),
    // [0, 0, 0, 0]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip3.show).on("mouseout", tip3.hide);
  bars4.append('path').attr("class", "bar bottom").attr("d", d => {
    // var corners = (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) ? [10, 10, 10, 10] : [0, 0, 10, 10];
    var corners;

    if (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) {
      corners = [10, 10, 10, 10];
    } else if (d.percentage4 < 5 && d.percentage4 > 0) {
      // corners = [0, 0, 3, 0]
      corners = [0, 0, 3, 3]; // corners = [0, 0, 5, 5]
    } else {
      corners = [0, 0, 10, 10];
    }

    return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val4), // [0, 0, 10, 10]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip4.show).on("mouseout", tip4.hide);
  bars1.append("text").text(function (d) {
    // return d.percentage2  >= 5 ? percentageText(d.percentage1) : "";
    if (isMobile) {
      return d.percentage1 >= 7.5 ? percentageText(d.percentage1) : "";
    } else {
      return d.percentage1 >= 5 ? percentageText(d.percentage1) : "";
    } // return ( percentageText(d.percentage1) );

  }).attr("class", "stacked bar-label first top").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val1) + (yScale(0) - yScale(d.percentage1)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars2.append("text").text(function (d) {
    if (isMobile) {
      return d.percentage2 >= 7.5 ? percentageText(d.percentage2) : "";
    } else {
      return d.percentage2 >= 5 ? percentageText(d.percentage2) : "";
    } // return ( percentageText(d.percentage2) );

  }).attr("class", "stacked bar-label upper").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val2) + (yScale(0) - yScale(d.percentage2)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars3.append("text").text(function (d) {
    // return d.percentage3  >= 5 ? percentageText(d.percentage3) : "";
    if (isMobile) {
      return d.percentage3 >= 7.5 ? percentageText(d.percentage3) : "";
    } else {
      return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
    } // return ( percentageText(d.percentage3) );

  }).attr("class", "stacked bar-label lower").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(0) + (yScale(d.val3) - yScale(0)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars4.append("text").text(function (d) {
    // return d.percentage4  >= 5 ? percentageText(d.percentage4) : "";
    if (isMobile) {
      return d.percentage4 >= 7.5 ? percentageText(d.percentage4) : "";
    } else {
      return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
    } // return ( percentageText(d.percentage4) );

  }).attr("class", "stacked bar-label bottom").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val3) + (yScale(d.val4) - yScale(d.val3)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");

  var xAxis = g => g.attr("transform", `translate(0,${innerHeight + margin.nSpace})`).call(d3.axisBottom(xScale).tickFormat(label => label).tickSize(0).tickPadding(15));

  svg.append("g").attr("class", "x axis") // .attr("transform", "translate(0," + axisHeight + ")")
  .call(xAxis).selectAll(".tick text").call(wrap, xScale.bandwidth());
  svg.append('g').append('line').attr("class", "center-line").style("stroke", "#C9E0E9").style("stroke-width", 2).attr("stroke-dasharray", "4").attr("x1", 35).attr("y1", yScale(0)).attr("x2", width - margin.right - 35).attr("y2", yScale(0));
  var wrapWidth = isMobile ? xScale.range()[1] * .85 : 400;
  svg.append("g").append("text").attr("class", "no-data-text").style("opacity", 0).text("This question is only asked of respondents who are associated with a partner organization.").attr("x", "50%").attr("y", innerHeight * .4).call(noDataWrap, wrapWidth);
}

function updateStackedChart(containerID, data) {
  console.log(containerID + " should update stack type 1 with: ", data);
  var container = d3.select("#" + containerID),
      xScale = window.xScales[containerID],
      yScale = window.yScales[containerID];
  var bars1 = container.selectAll(".bar.top"),
      bars4 = container.selectAll(".bar.bottom"),
      bars2 = container.selectAll(".bar.upper"),
      bars3 = container.selectAll(".bar.lower");
  var maxTotal = d3.max(data, function (d) {
    return d.total;
  });
  yScale.domain([d3.min(data, function (d) {
    return d.val4;
  }), d3.max(data, function (d) {
    return d.val1;
  })]); //.nice();

  if (maxTotal > 0) {
    container.select(".no-data-text").transition().duration(200).style("opacity", 0);
  }

  var bar1Labels = container.selectAll(".bar-label.top").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage1  >= 5 ? percentageText(d.percentage1) : "";
      if (isMobile) {
        return d.percentage1 >= 7.5 ? percentageText(d.percentage1) : "";
      } else {
        return d.percentage1 >= 5 ? percentageText(d.percentage1) : "";
      } // return ( percentageText(d.percentage1) );

    }).attr("y", function (d) {
      return yScale(d.val1) + (yScale(0) - yScale(d.percentage1)) / 2 + 6;
    });
  });
  var bar2Labels = container.selectAll(".bar-label.upper").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage2  >= 5 ? percentageText(d.percentage2) : "";
      if (isMobile) {
        return d.percentage2 >= 7.5 ? percentageText(d.percentage2) : "";
      } else {
        return d.percentage2 >= 5 ? percentageText(d.percentage2) : "";
      } // return ( percentageText(d.percentage2) );

    }).attr("y", function (d) {
      return yScale(d.val2) + (yScale(0) - yScale(d.percentage2)) / 2 + 6;
    });
  });
  var bar3Labels = container.selectAll(".bar-label.lower").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
      if (isMobile) {
        return d.percentage3 >= 7.5 ? percentageText(d.percentage3) : "";
      } else {
        return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
      } // return ( percentageText(d.percentage3) );

    }).attr("y", function (d) {
      return yScale(0) + (yScale(d.val3) - yScale(0)) / 2 + 6;
    });
  });
  var bar4Labels = container.selectAll(".bar-label.bottom").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
      if (isMobile) {
        return d.percentage4 >= 7.5 ? percentageText(d.percentage4) : "";
      } else {
        return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
      } // return ( percentageText(d.percentage4) );

    }).attr("y", function (d) {
      return yScale(d.val3) + (yScale(d.val4) - yScale(d.val3)) / 2 + 6;
    });
  });
  var nText = container.selectAll(".n-text").data(data).transition().duration(250).style("opacity", 0).on("end", function (d) {
    d3.select(this).text(function (d) {
      return "(n=" + d.total + ")";
    });
  });
  bars1.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      // var corners = (d.a2 === 0 && d.a3 === 0 && d.a4 === 0) ? [10, 10, 10, 10] : [10, 10, 0, 0];
      var corners = [10, 10, 0, 0];
      return roundedRect(xScale(d.label), yScale(d.val1), xScale.bandwidth(), yScale(0) - yScale(d.val1), corners);
    });
  });
  bars2.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      var corners = d.a1 === 0 ? [10, 10, 0, 0] : [0, 0, 0, 0];
      return roundedRect(xScale(d.label), yScale(d.val2), xScale.bandwidth(), yScale(0) - yScale(d.val2), corners);
    });
  });
  bars3.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      var corners = d.a4 === 0 ? [0, 0, 10, 10] : [0, 0, 0, 0];
      return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val3), corners);
    });
  });
  bars4.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      // var corners = (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) ? [10, 10, 10, 10] : [0, 0, 10, 10];
      var corners;

      if (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) {
        corners = [10, 10, 10, 10];
      } else if (d.percentage4 < 5 && d.percentage4 > 0) {
        // corners = [0, 0, 3, 0]
        corners = [0, 0, 3, 3]; // corners = [0, 0, 5, 5]
      } else {
        corners = [0, 0, 10, 10];
      }

      return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val4), corners);
    });
  });
  var line = container.select('.center-line').data(data).transition().delay(750).duration(200).style("opacity", 0).on("end", function () {
    d3.select(this).attr("y1", yScale(0)).attr("y2", yScale(0));
  });

  if (maxTotal > 0) {
    line.transition().delay(500).duration(200).style("opacity", 1);
  }

  bars1.transition().delay(1200).duration(500).style("opacity", 1);
  bars2.transition().delay(1200).duration(500).style("opacity", 1);
  bars3.transition().delay(1200).duration(500).style("opacity", 1);
  bars4.transition().delay(1200).duration(500).style("opacity", 1);
  bar1Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar2Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar3Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar4Labels.transition().delay(1700).duration(250).style("opacity", 1);
  nText.transition().delay(1700).duration(250).style("opacity", 1);

  if (maxTotal === 0) {
    container.select(".no-data-text").transition().delay(1700).duration(250).style("opacity", 1);
  }
}

function processStackedchartData(data, question) {
  var newData = [],
      processedYA = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    total: 0,
    label: "Overall"
  },
      processedY2 = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    total: 0,
    label: "Year 2 of Project Funding"
  },
      processedY3 = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    total: 0,
    label: "Year 3 of Project Funding"
  },
      year2,
      year3;
  year2 = data.filter(d => {
    return d.FundingYear === "2";
  });
  year3 = data.filter(d => {
    return d.FundingYear === "3";
  });
  var ia = data.length,
      i2 = year2.length,
      i3 = year3.length;
  data.forEach((d, i) => {
    switch (d[question]) {
      case "1":
        processedYA.a4 += 1;
        processedYA.total += 1;
        break;

      case "2":
        processedYA.a3 += 1;
        processedYA.total += 1;
        break;

      case "3":
        processedYA.a2 += 1;
        processedYA.total += 1;
        break;

      case "4":
        processedYA.a1 += 1;
        processedYA.total += 1;
        break;

      default:
    }

    if (i === ia - 1) {
      for (var i = 1; i < 6; i++) {
        if (processedYA[`a${i}`] > 0) {
          processedYA[`percentage${i}`] = Math.round10(processedYA[`a${i}`] / processedYA.total * 100, -1);
        } else {
          processedYA[`percentage${i}`] = 0;
        }
      }

      processedYA.val1 = processedYA.percentage1 + processedYA.percentage2;
      processedYA.val2 = processedYA.percentage2;
      processedYA.val3 = -processedYA.percentage3;
      processedYA.val4 = -(processedYA.percentage3 + processedYA.percentage4);
      newData.push(processedYA);
    }
  }); //process year 2 by question

  year2.forEach((d, i) => {
    switch (d[question]) {
      case "1":
        processedY2.a4 += 1;
        processedY2.total += 1;
        break;

      case "2":
        processedY2.a3 += 1;
        processedY2.total += 1;
        break;

      case "3":
        processedY2.a2 += 1;
        processedY2.total += 1;
        break;

      case "4":
        processedY2.a1 += 1;
        processedY2.total += 1;
        break;

      default:
    }

    if (i === i2 - 1) {
      for (var i = 1; i < 6; i++) {
        if (processedY2[`a${i}`] > 0) {
          processedY2[`percentage${i}`] = Math.round10(processedY2[`a${i}`] / processedY2.total * 100, -1);
        } else {
          processedY2[`percentage${i}`] = 0;
        }
      }

      processedY2.val1 = processedY2.percentage1 + processedY2.percentage2;
      processedY2.val2 = processedY2.percentage2;
      processedY2.val3 = -processedY2.percentage3;
      processedY2.val4 = -(processedY2.percentage3 + processedY2.percentage4);
      newData.push(processedY2);
    }
  }); //process year 3 by question

  year3.forEach((d, i) => {
    switch (d[question]) {
      case "1":
        processedY3.a4 += 1;
        processedY3.total += 1;
        break;

      case "2":
        processedY3.a3 += 1;
        processedY3.total += 1;
        break;

      case "3":
        processedY3.a2 += 1;
        processedY3.total += 1;
        break;

      case "4":
        processedY3.a1 += 1;
        processedY3.total += 1;
        break;

      default:
    }

    if (i === i3 - 1) {
      for (var i = 1; i < 6; i++) {
        if (processedY3[`a${i}`] > 0) {
          processedY3[`percentage${i}`] = Math.round10(processedY3[`a${i}`] / processedY3.total * 100, -1);
        } else {
          processedY3[`percentage${i}`] = 0;
        }
      }

      processedY3.val1 = processedY3.percentage1 + processedY3.percentage2;
      processedY3.val2 = processedY3.percentage2;
      processedY3.val3 = -processedY3.percentage3;
      processedY3.val4 = -(processedY3.percentage3 + processedY3.percentage4);
      newData.push(processedY3);
    }
  }); // var minval4 = d3.min(newData, (d)=>{ return d.val4 }),
  //     maxPE = d3.max(newData, (d)=>{ return d.percentage5 }),
  //     EEnd = (minval4 * 1.2) + (-maxPE);
  // newData[0].val5End = EEnd;
  // newData[1].val5End = EEnd;
  // newData[0].val5Start = EEnd + newData[0].percentage5;
  // newData[1].val5Start = EEnd + newData[1].percentage5;

  return newData;
}

function buildStackedChart2(containerID, data) {
  var container = d3.select("#" + containerID),
      width = container.node().clientWidth,
      height = container.node().clientHeight;
  var margin = {
    top: 10,
    right: 0,
    bottom: 60,
    left: 0,
    nSpace: 40
  },
      innerWidth = width - chartMargin.left - chartMargin.right,
      innerHeight = height - chartMargin.top - chartMargin.bottom;
  var xScale = d3.scaleBand().domain(data.map(d => d.label)).range([margin.left, innerWidth - margin.right]).padding(0.2);
  var yScale = d3.scaleLinear().domain([d3.min(data, function (d) {
    return d.val4;
  }) * 1.2 - d3.max(data, function (d) {
    return d.percentage5;
  }), d3.max(data, function (d) {
    return d.val1;
  })]) //.nice()
  .range([innerHeight, 0]);
  window.xScales[containerID] = xScale;
  window.yScales[containerID] = yScale;
  var tip1 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `This has been achieved<br><br>Count: ${d.a1}<br>Percent: ${d.percentage1}%`;
  }),
      tip2 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `We have made significant progress<br><br>Count: ${d.a2}<br>Percent: ${d.percentage2}%`;
  }),
      tip3 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `We have made some progress<br><br>Count: ${d.a3}<br>Percent: ${d.percentage3}%`;
  }),
      tip4 = d3.tip().attr('class', 'd3-tip').direction("s").html((EVENT, d) => {
    return `We have not started<br><br>Count: ${d.a4}<br>Percent: ${d.percentage4}%`;
  }),
      tip5 = d3.tip().attr('class', 'd3-tip').html((EVENT, d) => {
    return `Project has no current plans to do this<br><br>Count: ${d.a5}<br>Percent: ${d.percentage5}%`;
  });
  var svg = container.append('svg').attr("width", width).attr("height", height).attr("role", "graphics-datachart").attr("tabindex", "0").append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.call(tip1);
  svg.call(tip2);
  svg.call(tip3);
  svg.call(tip4);
  svg.call(tip5);
  var rx = 5,
      ry = 5; //Order of declarations matter

  var bars1 = svg.selectAll(".bar1").data(data).enter().append("g");
  var bars4 = svg.selectAll(".bar4").data(data).enter().append("g");
  var bars2 = svg.selectAll(".bar2").data(data).enter().append("g");
  var bars3 = svg.selectAll(".bar3").data(data).enter().append("g");
  var bars5 = svg.selectAll(".bar5").data(data).enter().append("g");
  var nText = svg.selectAll("g.n-text-g").data(data).enter().append("g").attr("class", "n-text-g").append("text").attr("class", "n-text").text(function (d) {
    return "(n=" + d.total + ")";
  }).attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", innerHeight + 10).attr("font-size", "14px").attr("text-anchor", "middle");
  bars1.append('path').attr("class", "bar top").attr("d", d => {
    // var corners = (d.a2 === 0 && d.a3 === 0 && d.a4 === 0) ? [10, 10, 10, 10] : [10, 10, 0, 0];
    var corners = [10, 10, 0, 0];
    return roundedRect(xScale(d.label), yScale(d.val1), xScale.bandwidth(), yScale(0) - yScale(d.val1), // [10, 10, 0, 0]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip1.show).on("mouseout", tip1.hide);
  bars2.append('path').attr("class", "bar upper").attr("d", d => {
    var corners = d.a1 === 0 ? [10, 10, 0, 0] : [0, 0, 0, 0];
    return roundedRect(xScale(d.label), yScale(d.val2), xScale.bandwidth(), yScale(0) - yScale(d.val2), // [0, 0, 0, 0]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip2.show).on("mouseout", tip2.hide);
  bars3.append('path').attr("class", "bar lower").attr("d", d => {
    var corners = d.a4 === 0 ? [0, 0, 10, 10] : [0, 0, 0, 0];
    return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val3), // [0, 0, 0, 0]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip3.show).on("mouseout", tip3.hide);
  bars4.append('path').attr("class", "bar bottom").attr("d", d => {
    // var corners = (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) ? [10, 10, 10, 10] : [0, 0, 10, 10];
    var corners;

    if (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) {
      corners = [10, 10, 10, 10];
    } else if (d.percentage4 < 5 && d.percentage4 > 0) {
      // corners = [0, 0, 3, 0]
      corners = [0, 0, 3, 3]; // corners = [0, 0, 5, 5]
    } else {
      corners = [0, 0, 10, 10];
    }

    return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val4), // [0, 0, 10, 10]   /* corner values of bar paths */
    corners);
  }).on("mouseover", tip4.show).on("mouseout", tip4.hide);
  bars5.append('path').attr("class", "bar nonstack").attr("d", d => roundedRect(xScale(d.label), yScale(d.val5Start), xScale.bandwidth(), yScale(0) - yScale(d.percentage5), //???
  [10, 10, 10, 10]
  /* corner values of bar paths */
  )).on("mouseover", tip5.show).on("mouseout", tip5.hide);
  bars1.append("text").text(function (d) {
    // return d.percentage1 >= 5 ? percentageText(d.percentage1) : "";
    if (isMobile) {
      return d.percentage1 >= 7.5 ? percentageText(d.percentage1) : "";
    } else {
      return d.percentage1 >= 5 ? percentageText(d.percentage1) : "";
    } // return ( percentageText(d.percentage1) );

  }).attr("class", "stacked bar-label first top").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val1) + (yScale(0) - yScale(d.percentage1)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars2.append("text").text(function (d) {
    // return d.percentage2 >= 5 ? percentageText(d.percentage2) : "";
    if (isMobile) {
      return d.percentage2 >= 7.5 ? percentageText(d.percentage2) : "";
    } else {
      return d.percentage2 >= 5 ? percentageText(d.percentage2) : "";
    } // return ( percentageText(d.percentage2) );

  }).attr("class", "stacked bar-label upper").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val2) + (yScale(0) - yScale(d.percentage2)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars3.append("text").text(function (d) {
    // return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
    if (isMobile) {
      return d.percentage3 >= 7.5 ? percentageText(d.percentage3) : "";
    } else {
      return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
    } // return ( percentageText(d.percentage3) );

  }).attr("class", "stacked bar-label lower").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(0) + (yScale(d.val3) - yScale(0)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars4.append("text").text(function (d) {
    // return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
    if (isMobile) {
      return d.percentage4 >= 7.5 ? percentageText(d.percentage4) : "";
    } else {
      return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
    } // return ( percentageText(d.percentage4) );

  }).attr("class", "stacked bar-label bottom").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val3) + (yScale(d.val4) - yScale(d.val3)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");
  bars5.append("text").text(function (d) {
    // return d.percentage5 >= 5 ? percentageText(d.percentage5) : "";
    if (isMobile) {
      return d.percentage5 >= 7.5 ? percentageText(d.percentage5) : "";
    } else {
      return d.percentage5 >= 5 ? percentageText(d.percentage5) : "";
    } // return ( percentageText(d.percentage5) );

  }).attr("class", "stacked bar-label nonstack").attr("x", function (d) {
    return xScale(d.label) + xScale.bandwidth() / 2;
  }).attr("y", function (d) {
    return yScale(d.val5Start) + (yScale(d.val5End) - yScale(d.val5Start)) / 2 + 6;
  }) // .attr("font-family" , "sans-serif")
  .attr("font-size", "14px").attr("text-anchor", "middle");

  var xAxis = g => g.attr("transform", `translate(0,${innerHeight + margin.nSpace})`).call(d3.axisBottom(xScale).tickFormat(label => label).tickSize(0).tickPadding(15));

  svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + innerHeight + ")").call(xAxis).selectAll(".tick text").call(wrap, xScale.bandwidth());
  svg.append('g').append('line').attr("class", "center-line").style("stroke", "#C9E0E9").style("stroke-width", 2).attr("stroke-dasharray", "4").attr("x1", 35).attr("y1", yScale(0)).attr("x2", width - chartMargin.right - 35).attr("y2", yScale(0));
  var wrapWidth = isMobile ? xScale.range()[1] * .85 : 400;
  svg.append("g").append("text").attr("class", "no-data-text").style("opacity", 0).text("This question is only asked of respondents who are associated with a partner organization.").attr("x", "50%").attr("y", innerHeight * .4).call(noDataWrap, wrapWidth);
}

function updateStackedChart2(containerID, data) {
  console.log(containerID + " should update stack type 2 with: ", data);
  var container = d3.select("#" + containerID),
      xScale = window.xScales[containerID],
      yScale = window.yScales[containerID];
  var bars1 = container.selectAll(".bar.top"),
      bars4 = container.selectAll(".bar.bottom"),
      bars2 = container.selectAll(".bar.upper"),
      bars3 = container.selectAll(".bar.lower"),
      bars5 = container.selectAll(".bar.nonstack");
  var maxTotal = d3.max(data, function (d) {
    return d.total;
  });
  yScale.domain([d3.min(data, function (d) {
    return d.val4;
  }) * 1.2 - d3.max(data, function (d) {
    return d.percentage5;
  }), d3.max(data, function (d) {
    return d.val1;
  })]).nice();

  if (maxTotal > 0) {
    container.select(".no-data-text").transition().duration(200).style("opacity", 0);
  }

  var bar1Labels = container.selectAll(".bar-label.top").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage1 >= 5 ? percentageText(d.percentage1) : "";
      if (isMobile) {
        return d.percentage1 >= 7.5 ? percentageText(d.percentage1) : "";
      } else {
        return d.percentage1 >= 5 ? percentageText(d.percentage1) : "";
      } // return ( percentageText(d.percentage1) );

    }).attr("y", function (d) {
      return yScale(d.val1) + (yScale(0) - yScale(d.percentage1)) / 2 + 6;
    });
  });
  var bar2Labels = container.selectAll(".bar-label.upper").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage2 >= 5 ? percentageText(d.percentage2) : "";
      if (isMobile) {
        return d.percentage2 >= 7.5 ? percentageText(d.percentage2) : "";
      } else {
        return d.percentage2 >= 5 ? percentageText(d.percentage2) : "";
      } // return ( percentageText(d.percentage2) );

    }).attr("y", function (d) {
      return yScale(d.val2) + (yScale(0) - yScale(d.percentage2)) / 2 + 6;
    });
  });
  var bar3Labels = container.selectAll(".bar-label.lower").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
      if (isMobile) {
        return d.percentage3 >= 7.5 ? percentageText(d.percentage3) : "";
      } else {
        return d.percentage3 >= 5 ? percentageText(d.percentage3) : "";
      } // return ( percentageText(d.percentage3) );

    }).attr("y", function (d) {
      return yScale(0) + (yScale(d.val3) - yScale(0)) / 2 + 6;
    });
  });
  var bar4Labels = container.selectAll(".bar-label.bottom").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
      if (isMobile) {
        return d.percentage4 >= 7.5 ? percentageText(d.percentage4) : "";
      } else {
        return d.percentage4 >= 5 ? percentageText(d.percentage4) : "";
      } // return ( percentageText(d.percentage4) );

    }).attr("y", function (d) {
      return yScale(d.val3) + (yScale(d.val4) - yScale(d.val3)) / 2 + 6;
    });
  });
  var bar5Labels = container.selectAll(".bar-label.nonstack").data(data).transition().duration(250).style("opacity", 0).on("end", function () {
    d3.select(this).text(function (d) {
      // return d.percentage5 >= 5 ? percentageText(d.percentage5) : "";
      if (isMobile) {
        return d.percentage5 >= 7.5 ? percentageText(d.percentage5) : "";
      } else {
        return d.percentage5 >= 5 ? percentageText(d.percentage5) : "";
      } // return ( percentageText(d.percentage5) );

    }).attr("y", function (d) {
      return yScale(d.val5Start) + (yScale(d.val5End) - yScale(d.val5Start)) / 2 + 6;
    });
  });
  var nText = container.selectAll(".n-text").data(data).transition().duration(250).style("opacity", 0).on("end", function (d) {
    d3.select(this).text(function (d) {
      return "(n=" + d.total + ")";
    });
  });
  bars1.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      // var corners = (d.a2 === 0 && d.a3 === 0 && d.a4 === 0) ? [10, 10, 10, 10] : [10, 10, 0, 0];
      var corners = [10, 10, 0, 0];
      return roundedRect(xScale(d.label), yScale(d.val1), xScale.bandwidth(), yScale(0) - yScale(d.val1), corners);
    });
  });
  bars2.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      var corners = d.a1 === 0 ? [10, 10, 0, 0] : [0, 0, 0, 0];
      return roundedRect(xScale(d.label), yScale(d.val2), xScale.bandwidth(), yScale(0) - yScale(d.val2), corners);
    });
  });
  bars3.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      var corners = d.a4 === 0 ? [0, 0, 10, 10] : [0, 0, 0, 0];
      return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val3), corners);
    });
  });
  bars4.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      // var corners = (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) ? [10, 10, 10, 10] : [0, 0, 10, 10];
      var corners;

      if (d.a2 === 0 && d.a3 === 0 && d.a1 === 0) {
        corners = [10, 10, 10, 10];
      } else if (d.percentage4 < 5 && d.percentage4 > 0) {
        // corners = [0, 0, 3, 0]
        corners = [0, 0, 3, 3]; // corners = [0, 0, 5, 5]
      } else {
        corners = [0, 0, 10, 10];
      }

      console.log("the corners", corners);
      return roundedRect(xScale(d.label), yScale(0), xScale.bandwidth(), yScale(0) - yScale(-d.val4), corners);
    });
  });
  bars5.data(data).transition().delay(250).duration(500).style("opacity", 0).on("end", function () {
    d3.select(this).attr("d", d => {
      var corners = d.a2 === 0 && d.a3 === 0 && d.a1 === 0 ? [10, 10, 10, 10] : [0, 0, 10, 10];
      return roundedRect(xScale(d.label), yScale(d.val5Start), xScale.bandwidth(), yScale(0) - yScale(d.percentage5), [10, 10, 10, 10]);
    });
  });
  var line = container.select('.center-line').data(data).transition().delay(750).duration(200).style("opacity", 0).on("end", function () {
    d3.select(this).attr("y1", yScale(0)).attr("y2", yScale(0));
  });

  if (maxTotal > 0) {
    line.transition().delay(500).duration(200).style("opacity", 1);
  }

  bars1.transition().delay(1200).duration(500).style("opacity", 1);
  bars2.transition().delay(1200).duration(500).style("opacity", 1);
  bars3.transition().delay(1200).duration(500).style("opacity", 1);
  bars4.transition().delay(1200).duration(500).style("opacity", 1);
  bars5.transition().delay(1200).duration(500).style("opacity", 1);
  bar1Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar2Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar3Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar4Labels.transition().delay(1700).duration(250).style("opacity", 1);
  bar5Labels.transition().delay(1700).duration(250).style("opacity", 1);
  nText.transition().delay(1700).duration(250).style("opacity", 1);

  if (maxTotal === 0) {
    container.select(".no-data-text").transition().delay(1700).duration(250).style("opacity", 1);
  }
}

function processStackedchartData2(data, question) {
  var newData = [],
      processedYA = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    a5: 0,
    total: 0,
    label: "Overall"
  },
      processedY2 = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    a5: 0,
    total: 0,
    label: "Year 2 of Project Funding"
  },
      processedY3 = {
    a1: 0,
    a2: 0,
    a3: 0,
    a4: 0,
    a5: 0,
    total: 0,
    label: "Year 3 of Project Funding"
  },
      year2,
      year3;
  year2 = data.filter(d => {
    return d.FundingYear === "2";
  });
  year3 = data.filter(d => {
    return d.FundingYear === "3";
  });
  var ia = data.length,
      i2 = year2.length,
      i3 = year3.length;
  data.forEach((d, i) => {
    switch (d[question]) {
      case "1":
        processedYA.a4 += 1;
        processedYA.total += 1;
        break;

      case "2":
        processedYA.a3 += 1;
        processedYA.total += 1;
        break;

      case "3":
        processedYA.a2 += 1;
        processedYA.total += 1;
        break;

      case "4":
        processedYA.a1 += 1;
        processedYA.total += 1;
        break;

      case "5":
        processedYA.a5 += 1;
        processedYA.total += 1;
        break;
    }

    if (i === ia - 1) {
      for (var i = 1; i < 6; i++) {
        if (processedYA[`a${i}`] > 0) {
          processedYA[`percentage${i}`] = Math.round10(processedYA[`a${i}`] / processedYA.total * 100, -1);
        } else {
          processedYA[`percentage${i}`] = 0;
        }
      }

      processedYA.val1 = processedYA.percentage1 + processedYA.percentage2;
      processedYA.val2 = processedYA.percentage2;
      processedYA.val3 = -processedYA.percentage3;
      processedYA.val4 = -(processedYA.percentage3 + processedYA.percentage4);
      newData.push(processedYA);
    }
  }); //process year 2 by question

  year2.forEach((d, i) => {
    switch (d[question]) {
      case "1":
        processedY2.a4 += 1;
        processedY2.total += 1;
        break;

      case "2":
        processedY2.a3 += 1;
        processedY2.total += 1;
        break;

      case "3":
        processedY2.a2 += 1;
        processedY2.total += 1;
        break;

      case "4":
        processedY2.a1 += 1;
        processedY2.total += 1;
        break;

      case "5":
        processedY2.a5 += 1;
        processedY2.total += 1;
        break;
    }

    if (i === i2 - 1) {
      for (var i = 1; i < 6; i++) {
        if (processedY2[`a${i}`] > 0) {
          processedY2[`percentage${i}`] = Math.round10(processedY2[`a${i}`] / processedY2.total * 100, -1);
        } else {
          processedY2[`percentage${i}`] = 0;
        }
      }

      processedY2.val1 = processedY2.percentage1 + processedY2.percentage2;
      processedY2.val2 = processedY2.percentage2;
      processedY2.val3 = -processedY2.percentage3;
      processedY2.val4 = -(processedY2.percentage3 + processedY2.percentage4);
      newData.push(processedY2);
    }
  }); //process year 3 by question

  year3.forEach((d, i) => {
    switch (d[question]) {
      case "1":
        processedY3.a4 += 1;
        processedY3.total += 1;
        break;

      case "2":
        processedY3.a3 += 1;
        processedY3.total += 1;
        break;

      case "3":
        processedY3.a2 += 1;
        processedY3.total += 1;
        break;

      case "4":
        processedY3.a1 += 1;
        processedY3.total += 1;
        break;

      case "5":
        processedY3.a5 += 1;
        processedY3.total += 1;
        break;
    }

    if (i === i3 - 1) {
      for (var i = 1; i < 6; i++) {
        if (processedY3[`a${i}`] > 0) {
          processedY3[`percentage${i}`] = Math.round10(processedY3[`a${i}`] / processedY3.total * 100, -1);
        } else {
          processedY3[`percentage${i}`] = 0;
        }
      }

      processedY3.val1 = processedY3.percentage1 + processedY3.percentage2;
      processedY3.val2 = processedY3.percentage2;
      processedY3.val3 = -processedY3.percentage3;
      processedY3.val4 = -(processedY3.percentage3 + processedY3.percentage4);
      newData.push(processedY3);
    }
  });
  var minval4 = d3.min(newData, d => {
    return d.val4;
  }),
      maxPE = d3.max(newData, d => {
    return d.percentage5;
  }),
      EEnd = minval4 * 1.2 + -maxPE;
  newData[0].val5End = EEnd;
  newData[1].val5End = EEnd;
  newData[2].val5End = EEnd;
  newData[0].val5Start = EEnd + newData[0].percentage5;
  newData[1].val5Start = EEnd + newData[1].percentage5;
  newData[2].val5Start = EEnd + newData[2].percentage5;
  return newData;
}

function populateFilters(containerID, data) {
  var source = $("#drop-filter-template").html();
  var template = Handlebars.compile(source);
  var html = template(data);
  $(containerID).append(html);
}

function uniqueValues(arr, prop) {
  var flags = [],
      output = [],
      l = arr.length,
      i;

  for (i = 0; i < l; i++) {
    if (flags[arr[i][prop]]) continue;
    flags[arr[i][prop]] = true;
    output.push(arr[i][prop]);
  }

  return output;
}

function demographicSpecialFormatting(val) {
  if (val === "Not collected" || val === "Not Collected") {
    return "Not collected by project";
  }

  if (val === "Not Provided" || val === "Not provided") {
    return "Not provided by respondent";
  }

  return val;
}

d3.csv('data/students-gender.csv', d => ({
  count: +d.Count,
  alliance: d.Alliance,
  // gender: (d.Gender === "Not collected"  || d.Gender === "Not Collected" ? "Not collected by project" : d.Gender),
  gender: demographicSpecialFormatting(d.Gender),
  programType: d.Program_Type,
  record: d.Record,
  servicePopulation: d.Service_Population,
  serviceType: d.Service_Type,
  studentType: d.Student_Type,
  year: d.Year
})).then(data => {
  studentData.gender = data;
}).then(() => {
  function listener(val) {
    var dataSet = "gender",
        filteredData = studentData.gender,
        checkbox = document.getElementById("student-gender-notcollected"),
        checked = checkbox.checked;

    if (checked) {
      filteredData = filteredData.filter(d => {
        return d.gender !== "Not collected by project";
      });
    }

    if (val !== "all") {
      filteredData = filteredData.filter(d => {
        return d.studentType == val;
      });
    }

    var processedData = processBarchartData(filteredData, dataSet);

    if (isMobile) {
      updateBarChartMobile("student-" + dataSet + "-bar-chart", processedData);
    } else {
      updatechart("student-" + dataSet + "-bar-chart", processedData);
    }

    populateTable("student", dataSet, processedData);
    changeBarChartAltText("student", dataSet, val, checked);
  }

  d3.select("#student-gender-studentType").on("change", e => {
    var val = e.target.value;
    listener(val);
  });
  d3.select("#student-gender-notcollected").on("change", e => {
    var val = document.getElementById("student-gender-studentType").value;
    listener(val);
  });
});
d3.csv('data/students-ethnicity.csv', d => ({
  count: +d.Count,
  alliance: d.Alliance,
  ethnicity: demographicSpecialFormatting(d.Ethnicity),
  programType: d.Program_Type,
  record: d.Record,
  servicePopulation: d.Service_Population,
  serviceType: d.Service_Type,
  studentType: d.Student_Type,
  year: d.Year
})).then(data => {
  studentData.ethnicity = data;
}).then(() => {
  function listener(val) {
    console.log("eth-list");
    var dataSet = "ethnicity",
        filteredData = studentData.ethnicity,
        checkbox = document.getElementById("student-ethnicity-notcollected"),
        checked = checkbox.checked;

    if (checked) {
      filteredData = filteredData.filter(d => {
        return d.ethnicity !== "Not collected by project";
      });
    }

    if (val !== "all") {
      filteredData = filteredData.filter(d => {
        return d.studentType == val;
      });
    }

    var processedData = processBarchartData(filteredData, dataSet);

    if (isMobile) {
      updateBarChartMobile("student-" + dataSet + "-bar-chart", processedData);
    } else {
      updatechart("student-" + dataSet + "-bar-chart", processedData);
    }

    populateTable("student", dataSet, processedData);
    changeBarChartAltText("student", dataSet, val, checked);
  }

  d3.select("#student-ethnicity-studentType").on("change", e => {
    var val = e.target.value;
    listener(val);
  });
  d3.select("#student-ethnicity-notcollected").on("change", e => {
    console.log("eth-check");
    var val = document.getElementById("student-ethnicity-studentType").value;
    listener(val);
  });
});
d3.csv('data/students-race.csv', d => ({
  count: +d.Count,
  alliance: d.Alliance,
  race: demographicSpecialFormatting(d.Race),
  programType: d.Program_Type,
  record: d.Record,
  servicePopulation: d.Service_Population,
  serviceType: d.Service_Type,
  studentType: d.Student_Type,
  year: d.Year
})).then(data => {
  studentData.race = data;
}).then(() => {
  function listener(val) {
    console.log("eth-list");
    var dataSet = "race",
        filteredData = studentData.race,
        checkbox = document.getElementById("student-race-notcollected"),
        checked = checkbox.checked;

    if (checked) {
      filteredData = filteredData.filter(d => {
        return d.race !== "Not collected by project";
      });
    }

    if (val !== "all") {
      filteredData = filteredData.filter(d => {
        return d.studentType == val;
      });
    }

    var processedData = processBarchartData(filteredData, dataSet);

    if (isMobile) {
      updateBarChartMobile("student-" + dataSet + "-bar-chart", processedData);
    } else {
      updatechart("student-" + dataSet + "-bar-chart", processedData);
    }

    populateTable("student", dataSet, processedData);
    changeBarChartAltText("student", dataSet, val, checked);
  }

  d3.select("#student-race-studentType").on("change", e => {
    var val = e.target.value;
    listener(val);
  });
  d3.select("#student-race-notcollected").on("change", e => {
    var val = document.getElementById("student-race-studentType").value;
    listener(val);
  });
}); // d3.csv('http://localhost:8888/data/educators-gender.csv', (d) => (

d3.csv('data/educators-gender.csv', d => ({
  count: +d.Count,
  alliance: d.Alliance,
  gender: demographicSpecialFormatting(d.Gender),
  programType: d.Program_Type,
  record: d.Record,
  servicePopulation: d.Service_Population,
  serviceType: d.Service_Type,
  educatorType: d.Educator_Type,
  year: d.Year
})).then(data => {
  // var filteredData = data.filter((d)=>{
  //     return d.educatorType !== "Other Non-PreK-12/IHE professionals";
  // })
  // educatorData.gender = filteredData;
  educatorData.gender = data;
}).then(() => {
  function listener(val) {
    var dataSet = "gender",
        filteredData = educatorData.gender,
        checkbox = document.getElementById("educator-gender-notcollected"),
        checked = checkbox.checked;

    if (checked) {
      filteredData = filteredData.filter(d => {
        return d.gender !== "Not collected by project";
      });
    }

    if (val !== "all") {
      filteredData = filteredData.filter(d => {
        return d.educatorType == val;
      });
    }

    var processedData = processBarchartData(filteredData, dataSet);

    if (isMobile) {
      updateBarChartMobile("educator-" + dataSet + "-bar-chart", processedData);
    } else {
      updatechart("educator-" + dataSet + "-bar-chart", processedData);
    }

    populateTable("educator", dataSet, processedData);
    changeBarChartAltText("educator", dataSet, val, checked);
  }

  d3.select("#educator-gender-educatorType").on("change", e => {
    var val = e.target.value;
    listener(val);
  });
  d3.select("#educator-gender-notcollected").on("change", e => {
    var val = document.getElementById("educator-gender-educatorType").value;
    listener(val);
  });
});
d3.csv('data/educators-ethnicity.csv', d => ({
  count: +d.Count,
  alliance: d.Alliance,
  ethnicity: demographicSpecialFormatting(d.Ethnicity),
  programType: d.Program_Type,
  record: d.Record,
  servicePopulation: d.Service_Population,
  serviceType: d.Service_Type,
  educatorType: d.Educator_Type,
  year: d.Year
})).then(data => {
  // var filteredData = data.filter((d)=>{
  //     return d.educatorType !== "Other Non-PreK-12/IHE professionals";
  // })
  // educatorData.ethnicity = filteredData;
  educatorData.ethnicity = data;
}).then(() => {
  function listener(val) {
    var dataSet = "ethnicity",
        filteredData = educatorData.ethnicity,
        checkbox = document.getElementById("educator-ethnicity-notcollected"),
        checked = checkbox.checked;

    if (checked) {
      filteredData = filteredData.filter(d => {
        return d.ethnicity !== "Not collected by project";
      });
    }

    if (val !== "all") {
      filteredData = filteredData.filter(d => {
        return d.educatorType == val;
      });
    }

    var processedData = processBarchartData(filteredData, dataSet);

    if (isMobile) {
      updateBarChartMobile("educator-" + dataSet + "-bar-chart", processedData);
    } else {
      updatechart("educator-" + dataSet + "-bar-chart", processedData);
    }

    populateTable("educator", dataSet, processedData);
    changeBarChartAltText("educator", dataSet, val, checked);
  }

  d3.select("#educator-ethnicity-educatorType").on("change", e => {
    var val = e.target.value;
    listener(val);
  });
  d3.select("#educator-ethnicity-notcollected").on("change", e => {
    var val = document.getElementById("educator-ethnicity-educatorType").value;
    listener(val);
  });
});
d3.csv('data/educators-race.csv', d => ({
  count: +d.Count,
  alliance: d.Alliance,
  race: demographicSpecialFormatting(d.Race),
  programType: d.Program_Type,
  record: d.Record,
  servicePopulation: d.Service_Population,
  serviceType: d.Service_Type,
  countType: d.Count_Type,
  educatorType: d.Educator_Type,
  year: d.Year
})).then(data => {
  // var filteredData = data.filter((d)=>{
  //     return d.educatorType !== "Other Non-PreK-12/IHE professionals";
  // })
  // educatorData.race = filteredData;
  educatorData.race = data;
}).then(() => {
  function listener(val) {
    var dataSet = "race",
        filteredData = educatorData.race,
        checkbox = document.getElementById("educator-race-notcollected"),
        checked = checkbox.checked;

    if (checked) {
      filteredData = filteredData.filter(d => {
        return d.race !== "Not collected by project";
      });
    }

    if (val !== "all") {
      filteredData = filteredData.filter(d => {
        return d.educatorType == val;
      });
    }

    var processedData = processBarchartData(filteredData, dataSet);

    if (isMobile) {
      updateBarChartMobile("educator-" + dataSet + "-bar-chart", processedData);
    } else {
      updatechart("educator-" + dataSet + "-bar-chart", processedData);
    }

    populateTable("educator", dataSet, processedData);
    changeBarChartAltText("educator", dataSet, val, checked);
  }

  d3.select("#educator-race-educatorType").on("change", e => {
    var val = e.target.value;
    listener(val);
  });
  d3.select("#educator-race-notcollected").on("change", e => {
    var val = document.getElementById("educator-race-educatorType").value;
    listener(val);
  });
});
d3.csv('data/survey-data.csv').then(data => {
  surveyData = data;
  /* Below code is for dynamically populated filters */

  /* Leave in case fucntionality is to be restored*/
  // var stackedOrgTypes = uniqueValues(data, "Q1_6");
  // for (var i = 1; i < 6; i++){
  //     populateFilters('#orgType' + i, stackedOrgTypes);
  // }
}).then(data => {
  var nav5 = d3.select('#nav5 .nav.nav-tabs a.active');

  if (nav5._groups[0][0] !== null) {
    var href = nav5.attr('href');
    d3.selectAll(href + " .chart-container").each(function (a, b, c, d) {
      var container = d3.select(this),
          containerID = this.id;

      if (container.select('svg').node() === null) {
        var chartType = container.attr('chart-type');
        setChartContainerHeight(containerID, 1);

        if (chartType === "stacked2") {
          var chartData = processStackedchartData2(surveyData, containerID);
          buildStackedChart2(containerID, chartData);
        } else {
          var chartData = processStackedchartData(surveyData, containerID);
          buildStackedChart(containerID, chartData);
        }
      }

      changeStackedChartAltText(containerID, "all");
    });
  }

  d3.selectAll('#nav5 .nav.nav-tabs a')._groups[0].forEach(d => {
    var href = d.getAttribute('href');
    var selects = d3.selectAll(href + " .stacked-filter-select");
    selects.on("change", e => {
      var val = e.target.value,
          filteredData;

      if (val !== "all") {
        filteredData = surveyData.filter(d => {
          return d.Q1_6 == val;
        });
      } else {
        filteredData = surveyData;
      } //grab all charts in href


      d3.selectAll(href + " .chart-container").each(function (blank, i, nodeList) {
        var container = d3.select(nodeList[i]),
            containerID = nodeList[i].id,
            chartType = container.attr('chart-type');

        if (chartType === "stacked2") {
          var chartData = processStackedchartData2(filteredData, containerID);
          updateStackedChart2(containerID, chartData);
        } else {
          var chartData = processStackedchartData(filteredData, containerID);
          updateStackedChart(containerID, chartData);
        }

        changeStackedChartAltText(containerID, val);
      });
    });
  });
});
//# sourceMappingURL=charts.js.map

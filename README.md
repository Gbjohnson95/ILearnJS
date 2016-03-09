# ILearnJS

This point of this is to build a platform independant replace-string/macro library for use with BYU-Idaho. 

Features planned for v0.1
- LaTeX rendering via KaTeX from Khan Academy. WAY faster than MathJax
- Retrieval of basic user data like names
- Retrieval of basic course info like course name & section number
- Link making to course calendar, home, and announcements

Some features I would like to implement down the road are

- Move to more efficient method of only pulling innerHTML once
- Grab a scripture using something like ##SCPTR:BoM/1Nep/3/2:10##
- Implement a ##DaysTillDue## and ##HoursTillDue##
- Get instructor info like ##InstructorEmail## and ##InstructorName##

# Fetch different epochs/time values

%define TIME() (days_since_2000() + 10957) * 86400

%define TIME_NS() (days_since_2000() + 10957) * 86400e+9


# Time zone detector adapted from @Bambozzle
# https://scratch.mit.edu/projects/662899804/
# As a UTC offset
%define TIMEZONE() 24 * floor(days_since_2000()) + ((current_hour() - 7) % 24 + 7) - floor(24 * days_since_2000())

list _time_tz_areas = [
    "Niue", 
    "Hawaii", 
    "Pacific", 
    "Alaska", 
    "Western US", 
    "Central US, Mexico", 
    "Central US, Columbia, Peru", 
    "Boliviam, Venezuela, Eastern US, Quebec", 
    "Greenland, Argentina, Chile, Eastern Brazil", 
    "Atlantic", 
    "Cape Verde", 
    "UK, Portugal, West Africa", 
    "Europe, Northwest Africa", 
    "Eastern Europe, Central Africa, Southern Africa, Egypt, Libya", 
    "Western Russia, Middle East, Eastern Africa", 
    "Oman, Caucuses", 
    "Central Asia, Pakistan", 
    "Kazakhstan, India", 
    "Siberia, Indochina", 
    "China, Mongolia, Western Australia",
    "Yaktusk, Japan, Korea",
    "Northeast Australia, Papua New Guinea",
    "Southeastern Australia, Tazmania",
    "Kamchatka, West Polynesia",
    "New Zealand, East Polynesia"
];

%define AREA_BY_TZ(tz) (_time_tz_areas[(tz) + 12])

%define SCRATCH_DAYS() (days_since_2000() - 2691)

%define CURRENT_MILLISECOND() 86400000 * days_since_2000() % 1000
%define CURRENT_MICROSECOND() 86400000000 * days_since_2000() % 1000

# datetime

struct datetime {
    year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
    second = 0,
    microsecond = 0,
    tz=0
}

%define DATETIME_NOW() datetime{ \
    year: current_year(), \
    month: current_month(), \
    day: current_date(), \
    hour: current_hour(), \
    minute: current_minute(), \
    second: current_second(), \
    microsecond: CURRENT_MILLISECOND() * 1000, \
    tz: TIMEZONE()}

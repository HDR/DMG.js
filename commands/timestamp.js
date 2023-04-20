const { SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName('timestamp')
        .setDescription('Convert a date to a timestamp')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time (Hour:Minute) 24 hour time')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('month')
                .setDescription('Month')
                .setRequired(true)
                .addChoices(
                    { name: 'January', value: 'January'},
                    { name: 'February', value: 'February'},
                    { name: 'March', value: 'March'},
                    { name: 'April', value: 'April'},
                    { name: 'May', value: 'May'},
                    { name: 'June', value: 'June'},
                    { name: 'July', value: 'July'},
                    { name: 'August', value: 'August'},
                    { name: 'September', value: 'September'},
                    { name: 'October', value: 'October'},
                    { name: 'November', value: 'November'},
                    { name: 'December', value: 'December'}
                ))
        .addStringOption(option =>
            option.setName('day')
                .setDescription('Day')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('timezone')
                .setDescription('Time Zone')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('style')
                .setDescription('Timestamp Style')
                .setRequired(true)
                .addChoices(
                    { name: 'Default', value: 'Default'},
                    { name: 'Short Time', value: 'Short Time'},
                    { name: 'Long Time', value: 'Long Time'},
                    { name: 'Short Date', value: 'Short Date'},
                    { name: 'Long Date', value: 'Long Date'},
                    { name: 'Short Date/Time', value: 'Short Date/Time'},
                    { name: 'Long Date/Time', value: 'Long Date/Time'},
                    { name: 'Relative Time', value: 'Relative Time'},
                )),

    async autocomplete(interaction){
        const focus = interaction.options.getFocused(true);
        let choices

        if(focus.name === 'day') {
            switch (interaction.options.getString('month')) {
                case 'January':
                case 'March':
                case 'May':
                case 'July':
                case 'August':
                case 'October':
                case 'December':
                    choices = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th', '31st']
                    break;
                case 'February':
                    if(new Date(interaction.options.getInteger('year'), 1, 29).getDate() !== 29) {
                        choices = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th']
                        break;
                    } else {
                        choices = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th']
                        break;
                    }
                case 'April':
                case 'June':
                case 'September':
                case 'November':
                    choices = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th', '13th', '14th', '15th', '16th', '17th', '18th', '19th', '20th', '21st', '22nd', '23rd', '24th', '25th', '26th', '27th', '28th', '29th', '30th']
                    break;
            }
        }

        if(focus.name === 'timezone') {
            choices = ['Europe/Andorra','Asia/Dubai','Asia/Kabul','Europe/Tirane','Asia/Yerevan','Antarctica/Casey','Antarctica/Davis','Antarctica/DumontDUrville','Antarctica/Mawson','Antarctica/Palmer','Antarctica/Rothera','Antarctica/Syowa','Antarctica/Troll','Antarctica/Vostok','America/Argentina/Buenos_Aires','America/Argentina/Cordoba','America/Argentina/Salta','America/Argentina/Jujuy','America/Argentina/Tucuman','America/Argentina/Catamarca','America/Argentina/La_Rioja','America/Argentina/San_Juan','America/Argentina/Mendoza','America/Argentina/San_Luis','America/Argentina/Rio_Gallegos','America/Argentina/Ushuaia','Pacific/Pago_Pago','Europe/Vienna','Australia/Lord_Howe','Antarctica/Macquarie','Australia/Hobart','Australia/Currie','Australia/Melbourne','Australia/Sydney','Australia/Broken_Hill','Australia/Brisbane','Australia/Lindeman','Australia/Adelaide','Australia/Darwin','Australia/Perth','Australia/Eucla','Asia/Baku','America/Barbados','Asia/Dhaka','Europe/Brussels','Europe/Sofia','Atlantic/Bermuda','Asia/Brunei','America/La_Paz','America/Noronha','America/Belem','America/Fortaleza','America/Recife','America/Araguaina','America/Maceio','America/Bahia','America/Sao_Paulo','America/Campo_Grande','America/Cuiaba','America/Santarem','America/Porto_Velho','America/Boa_Vista','America/Manaus','America/Eirunepe','America/Rio_Branco','America/Nassau','Asia/Thimphu','Europe/Minsk','America/Belize','America/St_Johns','America/Halifax','America/Glace_Bay','America/Moncton','America/Goose_Bay','America/Blanc-Sablon','America/Toronto','America/Nipigon','America/Thunder_Bay','America/Iqaluit','America/Pangnirtung','America/Atikokan','America/Winnipeg','America/Rainy_River','America/Resolute','America/Rankin_Inlet','America/Regina','America/Swift_Current','America/Edmonton','America/Cambridge_Bay','America/Yellowknife','America/Inuvik','America/Creston','America/Dawson_Creek','America/Fort_Nelson','America/Vancouver','America/Whitehorse','America/Dawson','Indian/Cocos','Europe/Zurich','Africa/Abidjan','Pacific/Rarotonga','America/Santiago','America/Punta_Arenas','Pacific/Easter','Asia/Shanghai','Asia/Urumqi','America/Bogota','America/Costa_Rica','America/Havana','Atlantic/Cape_Verde','America/Curacao','Indian/Christmas','Asia/Nicosia','Asia/Famagusta','Europe/Prague','Europe/Berlin','Europe/Copenhagen','America/Santo_Domingo','Africa/Algiers','America/Guayaquil','Pacific/Galapagos','Europe/Tallinn','Africa/Cairo','Africa/El_Aaiun','Europe/Madrid','Africa/Ceuta','Atlantic/Canary','Europe/Helsinki','Pacific/Fiji','Atlantic/Stanley','Pacific/Chuuk','Pacific/Pohnpei','Pacific/Kosrae','Atlantic/Faroe','Europe/Paris','Europe/London','Asia/Tbilisi','America/Cayenne','Africa/Accra','Europe/Gibraltar','America/Godthab','America/Danmarkshavn','America/Scoresbysund','America/Thule','Europe/Athens','Atlantic/South_Georgia','America/Guatemala','Pacific/Guam','Africa/Bissau','America/Guyana','Asia/Hong_Kong','America/Tegucigalpa','America/Port-au-Prince','Europe/Budapest','Asia/Jakarta','Asia/Pontianak','Asia/Makassar','Asia/Jayapura','Europe/Dublin','Asia/Jerusalem','Asia/Kolkata','Indian/Chagos','Asia/Baghdad','Asia/Tehran','Atlantic/Reykjavik','Europe/Rome','America/Jamaica','Asia/Amman','Asia/Tokyo','Africa/Nairobi','Asia/Bishkek','Pacific/Tarawa','Pacific/Enderbury','Pacific/Kiritimati','Asia/Pyongyang','Asia/Seoul','Asia/Almaty','Asia/Qyzylorda','Asia/Qostanay','Asia/Aqtobe','Asia/Aqtau','Asia/Atyrau','Asia/Oral','Asia/Beirut','Asia/Colombo','Africa/Monrovia','Europe/Vilnius','Europe/Luxembourg','Europe/Riga','Africa/Tripoli','Africa/Casablanca','Europe/Monaco','Europe/Chisinau','Pacific/Majuro','Pacific/Kwajalein','Asia/Yangon','Asia/Ulaanbaatar','Asia/Hovd','Asia/Choibalsan','Asia/Macau','America/Martinique','Europe/Malta','Indian/Mauritius','Indian/Maldives','America/Mexico_City','America/Cancun','America/Merida','America/Monterrey','America/Matamoros','America/Mazatlan','America/Chihuahua','America/Ojinaga','America/Hermosillo','America/Tijuana','America/Bahia_Banderas','Asia/Kuala_Lumpur','Asia/Kuching','Africa/Maputo','Africa/Windhoek','Pacific/Noumea','Pacific/Norfolk','Africa/Lagos','America/Managua','Europe/Amsterdam','Europe/Oslo','Asia/Kathmandu','Pacific/Nauru','Pacific/Niue','Pacific/Auckland','Pacific/Chatham','America/Panama','America/Lima','Pacific/Tahiti','Pacific/Marquesas','Pacific/Gambier','Pacific/Port_Moresby','Pacific/Bougainville','Asia/Manila','Asia/Karachi','Europe/Warsaw','America/Miquelon','Pacific/Pitcairn','America/Puerto_Rico','Asia/Gaza','Asia/Hebron','Europe/Lisbon','Atlantic/Madeira','Atlantic/Azores','Pacific/Palau','America/Asuncion','Asia/Qatar','Indian/Reunion','Europe/Bucharest','Europe/Belgrade','Europe/Kaliningrad','Europe/Moscow','Europe/Simferopol','Europe/Kirov','Europe/Astrakhan','Europe/Volgograd','Europe/Saratov','Europe/Ulyanovsk','Europe/Samara','Asia/Yekaterinburg','Asia/Omsk','Asia/Novosibirsk','Asia/Barnaul','Asia/Tomsk','Asia/Novokuznetsk','Asia/Krasnoyarsk','Asia/Irkutsk','Asia/Chita','Asia/Yakutsk','Asia/Khandyga','Asia/Vladivostok','Asia/Ust-Nera','Asia/Magadan','Asia/Sakhalin','Asia/Srednekolymsk','Asia/Kamchatka','Asia/Anadyr','Asia/Riyadh','Pacific/Guadalcanal','Indian/Mahe','Africa/Khartoum','Europe/Stockholm','Asia/Singapore','America/Paramaribo','Africa/Juba','Africa/Sao_Tome','America/El_Salvador','Asia/Damascus','America/Grand_Turk','Africa/Ndjamena','Indian/Kerguelen','Asia/Bangkok','Asia/Dushanbe','Pacific/Fakaofo','Asia/Dili','Asia/Ashgabat','Africa/Tunis','Pacific/Tongatapu','Europe/Istanbul','America/Port_of_Spain','Pacific/Funafuti','Asia/Taipei','Europe/Kiev','Europe/Uzhgorod','Europe/Zaporozhye','Pacific/Wake','America/New_York','America/Detroit','America/Kentucky/Louisville','America/Kentucky/Monticello','America/Indiana/Indianapolis','America/Indiana/Vincennes','America/Indiana/Winamac','America/Indiana/Marengo','America/Indiana/Petersburg','America/Indiana/Vevay','America/Chicago','America/Indiana/Tell_City','America/Indiana/Knox','America/Menominee','America/North_Dakota/Center','America/North_Dakota/New_Salem','America/North_Dakota/Beulah','America/Denver','America/Boise','America/Phoenix','America/Los_Angeles','America/Anchorage','America/Juneau','America/Sitka','America/Metlakatla','America/Yakutat','America/Nome','America/Adak','Pacific/Honolulu','America/Montevideo','Asia/Samarkand','Asia/Tashkent','America/Caracas','Asia/Ho_Chi_Minh','Pacific/Efate','Pacific/Wallis','Pacific/Apia','Africa/Johannesburg']
        }

        const filtered = choices.filter(choice => choice.includes(focus.value));
        let options
        if (filtered.length > 25) {
            options = filtered.slice(0,25);
        } else {
            options = filtered
        }
        await interaction.respond(options.map(choice => ({ name: choice, value: choice})))

    },

    async execute(interaction) {
        if(!interaction.options.getString('time').toUpperCase().includes('PM') || interaction.options.getString('time').toUpperCase().includes('AM')) {
            let date = Date.parse(`${interaction.options.getString('day').slice(0, -2)} ${interaction.options.getString('month')} ${interaction.options.getInteger('year')} ${interaction.options.getString('time')} ${Intl.DateTimeFormat([], {
                timeZone: interaction.options.getString('timezone'),
                timeZoneName: 'longOffset'
            }).format(new Date).split(' ')[1]}`)
            let timestamp

            switch (interaction.options.getString('style')) {
                case 'Default':
                    timestamp = `<t:${Math.trunc(date / 1000)}>`
                    break;
                case 'Short Time':
                    timestamp = `<t:${Math.trunc(date / 1000)}:t>`
                    break;
                case 'Long Time':
                    timestamp = `<t:${Math.trunc(date / 1000)}:T>`
                    break;
                case 'Short Date':
                    timestamp = `<t:${Math.trunc(date / 1000)}:d>`
                    break;
                case 'Long Date':
                    timestamp = `<t:${Math.trunc(date / 1000)}:D>`
                    break;
                case 'Short Date/Time':
                    timestamp = `<t:${Math.trunc(date / 1000)}:f>`
                    break;
                case 'Long Date/Time':
                    timestamp = `<t:${Math.trunc(date / 1000)}:F>`
                    break;
                case 'Relative Time':
                    timestamp = `<t:${Math.trunc(date / 1000)}:R>`
                    break;
            }

            interaction.reply({content: `${timestamp}\n \`${timestamp}\``, ephemeral: true})
        } else {
            interaction.reply({content: 'Please use 24 hour time (Example: 13:45)', ephemeral: true})
        }
    },
}
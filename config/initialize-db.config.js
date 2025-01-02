const paymentProviders  = [
    {
        providerId: "interpay",
        paymentMode: "MTN",
        isDefault:true
    },
    {
        providerId: "interpay",
        paymentMode: "VODAFONE",
        isDefault:true
    },
    {
        providerId: "interpay",
        paymentMode: "AIRTELTIGO",
        isDefault:true
    },
];

const apps =    [
        {
            "uuid": "123e4567-e89b-12d3-a456-426614174000",
            "userUuid": "987e6543-e21a-34c5-b678-123456789abc",
            "paymentModes": ["card", "wallet"],
            "appName":"My First App",
            "logoUrl":"https://cachetechs.com/img/site_logo/logo_2.png",
            "appId": "myAppId123",
            "apiKey": "apiKey456",
            "appSecret": "superSecretKey789",
            "alias": "My First App",
            "shouldSendClientCallback": true,
            "isActive": true
        },
        {
            "uuid": "223e4567-e89b-12d3-a456-426614174001",
            "userUuid": "887e6543-e21a-34c5-b678-123456789abd",
            "paymentModes": ["crypto"],
            "appName":"My Second App",
            "logoUrl":"https://cachetechs.com/img/site_logo/logo_2.png",
            "appId": "anotherAppId321",
            "apiKey": "apiKey654",
            "appSecret": "anotherSecretKey987",
            "alias": "Crypto Payment App",
            "shouldSendClientCallback": false,
            "isActive": true
        },
        {
            "uuid": "323e4567-e89b-12d3-a456-426614174002",
            "userUuid": "787e6543-e21a-34c5-b678-123456789abe",
            "paymentModes": ["card", "wallet", "crypto"],
            "appName":"My Third App",
            "logoUrl":"https://cachetechs.com/img/site_logo/logo_2.png",
            "appId": "thirdAppId789",
            "apiKey": "apiKey987",
            "appSecret": "yetAnotherSecretKey321",
            "alias": "Universal Payment App",
            "shouldSendClientCallback": true,
            "isActive": false
        }
    ];

const providerConfigs = [
    {
        appId:"7jTzXC15429767856C9A681Ml85kD0C5",
        providerId:"interpay",
        settingName:"interPayBaseUrl",
        settingValue:"",
        isDefault:true
    },
    {
        appId:"7jTzXC15429767856C9A681Ml85kD0C5",
        providerId:"interpay",
        settingName:"interPayAppId",
        settingValue:"",
        isDefault:true
    },
    {
        appId:"7jTzXC15429767856C9A681Ml85kD0C5",
        providerId:"interpay",
        settingName:"interPayAppKey",
        settingValue:"",
        isDefault:true
    },
];

module.exports ={
    apps,
    providerConfigs,
    paymentProviders
};
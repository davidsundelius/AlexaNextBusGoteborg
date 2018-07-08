'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');

const APP_ID = 'amzn1.ask.skill.c888b9c1-772f-4f13-8f2c-487e969dee6a';

const handlers = {
    'NewSession': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.HelpIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.RepeatIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('MESSAGE', '60', 'Masthugget', '12:45', 'Vagnhallen Gårda'));
    },
};

const languageStrings = {
    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            MESSAGE: "Your next commute with number %s headed for %s will leave at %s from %s"
        }
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

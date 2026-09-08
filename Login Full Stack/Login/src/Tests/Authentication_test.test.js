import {expect, test} from 'vitest'
import {Auth} from '../Auth'

import {DB} from '../Database_Driver'
//import {Auth} from '@Login-FullStack/Login Full Stack/Login/src'

console.log("yoyo")

const x = 5;
test('first Test', () => {
    expect(x).toBe(5);
})

const authObj = new Auth();
test('Create user', () => {
    
    Auth.createUser("userName", "Password");

    const exists = userExists();
    expect(exists).toBe(true);

})
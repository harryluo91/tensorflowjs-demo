/**
* This file is meant to hold any utilities for interacting with client-side storage, be it cookies, localStorage, or
* sessionStorage. Any individual components that need to interact with the store can create an instance of storage
* to allow for a separate mgmt of storage. A default storage is created to start for quick usuage.
*/

export const STORAGE_TYPES = {
	local: 'LOCAL',
	session: 'SESSION',
};

const STORAGE_MAPPING = {
	LOCAL: window.localStorage,
	SESSION: window.sessionStorage,
};

class Storage {
	constructor(name, type) {
		this.name = `awesomeapp.${name}`;
		this.type = type;
		this.store = STORAGE_MAPPING[type];
	}
	get() {
		const item = this.store.getItem(this.name);
		if (item === 'null') {
			return null;
		} else if (item === 'false') {
			return false;
		} else if (item === 'true') {
			return true;
		}
		return item;
	}
	set(value) {
		try {
			this.store.setItem(this.name, value);
		} catch (err) {
			throw Error(`Error setting ${value} in storage ${this.name}. \n ${err}`);
		}
		return this;
	}
	remove() {
		try {
			this.store.removeItem(this.name);
		} catch (err) {
			throw Error(`Error removing storage with name ${this.name}. \n ${err}`);
		}
		return this;
	}
	getIn(key) {
		return JSON.parse(this.store.getItem(this.name))[key];
	}
	setIn(childKey, value) {
		const toSave = {};
		toSave[childKey] = value;
		this.store.setItem(this.name, JSON.stringify(toSave));
		return this;
	}
	removeIn(key) {
		const parent = JSON.parse(this.store.getItem(this.name));
		delete parent[key];
		this.store.setItem(this.name, JSON.stringify(parent));
		return this;
	}
}

// Private dict that holds references to instances of `Storage`
const managedStorage = {};

// Private helper.
const loopAndLoad = (storage, storageType) => {
	Object.keys(storage).forEach(k => {
		const removeNameSpace = k.replace('awesomeapp.', '');
		if (!managedStorage[removeNameSpace]) {
			managedStorage[removeNameSpace] = new Storage(removeNameSpace, storageType);
		}
	});
};

class StorageManager {

	constructor() {
		this._loadStorage();
	}

	createOrFetchStorage(name, type) {
		if (managedStorage[name] && type === managedStorage[name].type) {
			return managedStorage[name];
		}
		const newStorage = new Storage(name, type);
		managedStorage[name] = newStorage;
		return newStorage;
	}

	_loadStorage() {
		loopAndLoad(window.sessionStorage, STORAGE_TYPES.session);
		loopAndLoad(window.localStorage, STORAGE_TYPES.local);
	}
}

export const storageManager = new StorageManager();

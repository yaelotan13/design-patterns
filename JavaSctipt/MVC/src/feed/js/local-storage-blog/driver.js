import i18next from 'i18next';
import Controller from './controller/app';
import model from './model/model';
import view from './view/view';
import CRUD from './model/CRUD-local-storage';


const localStorageModel = model.getInstance(CRUD, i18next.t('image pool key'));
const webView = view.ViewCls;
const app = new Controller(localStorageModel, webView);

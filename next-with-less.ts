// Объявление для плагина next-with-less
declare module "next-with-less";

// Объявление для CSS/LESS модулей
declare module "*.module.less" {
    const classes: { [key: string]: string };
    export default classes;
}

// Объявление для обычных LESS файлов
declare module "*.less" {
    const content: { [key: string]: string };
    export default content;
}
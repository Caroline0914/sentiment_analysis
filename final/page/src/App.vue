<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
*{
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
}
::-webkit-scrollbar{
  width: 6px;
  height: 10px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-track{
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  border-radius: 10px;
  background-color: #F5F5F5;
}
::-webkit-scrollbar-thumb{
  border-radius: 10px;
  background-color: #999;
}
.el-table th{
  display: table-cell!important;
}
</style>

import Sistemas from "../../models/manager/sistema.js";
import Perfil from "../../models/manager/perfil.js";
import Modulo from "../../models/manager/modulo.js";
import Grupo from "../../models/manager/grupo.js";
import Menu from "../../models/manager/menu.js";
import Cliente from "../../models/manager/clientes.js";
import TiSisCliente from "../../models/manager/tiSisCliente.js";
import { sequelize } from "../../config/postgres/sequelize.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fsp = require("fs").promises;
const path = require("path");
import { fileURLToPath } from "url";
import { dirname } from "path";
import IntAuthenticate from "../../models/security/intAuthenticate.js";
import { generatePasswordHash } from "../../helpers/comparePassword.js";
import SuperGrupo from "../../models/manager/superGrupos.js";
import GrupoCapa from "../../models/manager/gruposCapa.js";
import Capa from "../../models/manager/capas.js";
import CapaByRol from "../../models/manager/capasByRol.js";
import Geoportal from "../../models/manager/geoportal.js";
import GeoportalComponent from "../../models/manager/geoportalComponent.js";
import OrdenCapa from "../../models/manager/ordenCapas.js";
import Solicitud from "../../models/manager/solicitud.js";
import {
  compileReseteoTemplate,
  compileWelcomeTemplate,
  sendMail,
} from "../../helpers/sendMail.js";
import TgUsuario from "../../models/security/tgUsuario.js";
import Actividades from "../../models/manager/actividades.js";
import ActividadesFotos from "../../models/manager/actividadesFotos.js";
import { log } from "console";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ManagerService {
  async saveActividadesFoto(id_actividad, c_ruta_foto) {
    try {
      const data = await ActividadesFotos.create({
        id_actividad,
        c_ruta_foto,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveActividades(c_titulo, c_subtitulo, c_descripcion) {
    try {
      const data = await Actividades.create({
        c_titulo,
        c_subtitulo,
        c_descripcion,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async updateActividades(c_titulo, c_subtitulo, c_descripcion, id_actividad) {
    try {
      const data = await Actividades.update(
        {
          c_titulo,
          c_subtitulo,
          c_descripcion,
        },
        { where: { id_actividad } }
      );
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async deleteActividades(id_actividad) {
    try {
      const data = await Actividades.destroy({ where: { id_actividad } });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async getActividadesFotosIdFoto(id_foto) {
    try {
      const data = await ActividadesFotos.findOne({ where: { id_foto } });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio." + error);
    }
  }

  async deleteActividadesFotos(id_foto) {
    try {
      const data = await ActividadesFotos.destroy({ where: { id_foto } });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio." + error);
    }
  }

  async saveModuloSistema(pk_sistema, c_modulo, c_descripcion, url, icono) {
    try {
      const data = await Modulo.create({
        pk_sistema,
        c_modulo,
        c_descripcion,
        url,
        icono,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveGrupoSistema(pk_modulo, c_nombre, url) {
    try {
      const data = await Grupo.create({
        pk_modulo,
        c_nombre,
        url,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveMenuSistema(pk_grupo, c_nombre, icono, url) {
    try {
      const data = await Menu.create({
        pk_grupo,
        c_nombre,
        icono,
        url,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  //CAPAS
  async saveSuperGrupoSistema(
    pk_sistema,
    fk_cliente,
    c_modulo,
    c_descripcion,
    icono
  ) {
    try {
      const data = await SuperGrupo.create({
        c_nombre_super_grupo: c_modulo,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveGrupoCapasSistema(pk_sistema, pk_modulo, fk_cliente, c_nombre) {
    try {
      const data = await GrupoCapa.create({
        id_super_grupo: pk_modulo,
        c_nombre_grupo: c_nombre,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveCapasSistema(
    pk_sistema,
    pk_grupo,
    fk_cliente,
    c_nombre,
    c_tabla,
    icono
  ) {
    try {
      const data = await Capa.create({
        id_grupo: pk_grupo,
        c_nombre_tabla_capa: c_tabla,
        c_nombre_public_capa: c_nombre,
        c_sql_capa: "1",
        c_tipo: "interno",
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveCapasByRol(
    fk_rol,
    fk_capa,
    id_usuario_auditoria,
    id_rol_auditoria
  ) {
    try {
      const data = await CapaByRol.create({
        fk_rol,
        fk_capa,
        id_usuario_auditoria,
        id_rol_auditoria,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear " + error);
    }
  }

async getRolByIdCliente(id_cliente) {
  try {
    const [response, metadata] = await sequelize.query(`
      select * from seguridad.tseg_roles
      where id_cliente = `+ id_cliente +` and c_nombre_rol ilike '%invitado%';
    `);
    // console.log(response);
    return response[0].id_rol;
  } catch (error) {
    throw new Error("Error al crear " + error);
  }
}
  async getCapasOrdenByIdRol(fk_rol) {
    try {
      let orden = await OrdenCapa.findOne({
        where: {
          fk_rol: fk_rol,
        },
      });
      if (orden) {
        orden = orden.dataValues.j_orden
      }
      return orden;
    } catch (error) {
      throw new Error("Error al crear " + error);
    }
  }

  async postCapasOrdenByIdRol(fk_rol) {
    try {
          const [superGrupos, metadata] = await sequelize.query(
            `select distinct sp.* from administracion.tadm_capas_supergrupo sp
          inner join administracion.tadm_capas_grupo cp on sp.id_super_grupo=cp.id_super_grupo
          inner join administracion.tadm_capas tc on cp.id_grupo=tc.id_grupo
          inner join administracion.rol_capas rc on tc.id_capa=rc.fk_capa
          where fk_rol=${fk_rol}`
          );
          const dbResponse = superGrupos;
          for (let index = 0; index < superGrupos.length; index++) {
            const element = superGrupos[index];
            const [grupos, metadata] = await sequelize.query(
              `select distinct cp.* from administracion.tadm_capas_supergrupo sp
          inner join administracion.tadm_capas_grupo cp on sp.id_super_grupo=cp.id_super_grupo
          inner join administracion.tadm_capas tc on cp.id_grupo=tc.id_grupo
          inner join administracion.rol_capas rc on tc.id_capa=rc.fk_capa
          where fk_rol=${fk_rol} and cp.id_super_grupo = ${element.id_super_grupo}`
            );
            for (let index = 0; index < grupos.length; index++) {
              const element = grupos[index];
              const [capas, metadata] = await sequelize.query(
                `select distinct tc.* from administracion.tadm_capas_supergrupo sp
                inner join administracion.tadm_capas_grupo cp on sp.id_super_grupo=cp.id_super_grupo
                inner join administracion.tadm_capas tc on cp.id_grupo=tc.id_grupo
                inner join administracion.rol_capas rc on tc.id_capa=rc.fk_capa
                where fk_rol=${fk_rol} and tc.id_grupo = ${element.id_grupo}`
              );
              element.capas = capas;
            }
            element.grupos = grupos;
          }
        await OrdenCapa.create({
          fk_rol,
          j_orden: dbResponse,
        })
      return dbResponse;
    } catch (error) {
      throw new Error("Error al crear " + error);
    }
  }

  async saveOrdenByRol(fk_rol, j_orden) {
    try {
      const orden = await OrdenCapa.findOne({
        where: {
          fk_rol: fk_rol,
        },
      });

      if (orden) {
        await OrdenCapa.update(
          {
            j_orden,
          },
          { where: { fk_rol } }
        );
      } else {
        await OrdenCapa.create({
          fk_rol,
          j_orden,
        });
      }

      return orden;
    } catch (error) {
      throw new Error("Error al crear " + error);
    }
  }
  //

  //DELETES
  async deleteModuloSistema(id) {
    try {
      const data = await Modulo.destroy({
        where: {
          id: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async deleteGrupoSistema(id) {
    try {
      const data = await Grupo.destroy({
        where: {
          id: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async deleteMenuSistema(id) {
    try {
      const data = await Menu.destroy({
        where: {
          id: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async deleteCapasByRol(id, id_usuario_auditoria, id_rol_auditoria) {
    try {
      await CapaByRol.update(
        {
          id_usuario_auditoria,
          id_rol_auditoria,
        },
        {
          where: {
            id: id,
          },
        }
      );
      const data = await CapaByRol.destroy({
        where: {
          id: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al eliminar.");
    }
  }
  //FIN DELETES

  async getSistemas() {
    try {
      const data = await Geoportal.findAll();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async getActividades() {
    try {
      const data = await Actividades.findAll({
        order: [
          ['id_actividad', 'DESC']
        ]
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async getActividadesFotos(id_actividad) {
    try {
      const data = await ActividadesFotos.findAll({ where: { id_actividad } });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio." + error);
    }
  }

  async getSistemabyId(id) {
    try {
      const data = await Sistemas.findOne({
        where: {
          id: id,
        },
      });
      const perfiles = await Perfil.findAll({
        where: {
          pk_sistema: id,
        },
      });

      const modulos = await Modulo.findAll({
        where: {
          pk_sistema: id,
        },
      });

      const grupos = await Grupo.findAll();
      const menu = await Menu.findAll();

      return { data, perfiles, modulos, grupos, menu };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async getCapasById(id) {
    try {
      const modulos = await SuperGrupo.findAll();
      const grupos = await GrupoCapa.findAll();
      const menu = await Capa.findAll();
      const rol_capas = await CapaByRol.findAll({
        where: {
          fk_rol: id,
        },
      });

      return { modulos, grupos, menu, rol_capas };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  //CLIENTES

  async getClientes() {
    try {
      const data = await Cliente.findAll();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async getClientesById(id) {
    try {
      const data = await Cliente.findOne({
        where: {
          id: id,
        },
      });

      const sistemas = await Sistemas.findAll();

      const sistemasUser = await TiSisCliente.findAll({
        where: {
          fk_cliente: id,
        },
      });

      const sistemas_match = sistemas.map((sistema) => {
        const sistemaUser = sistemasUser.find((userSistema) => {
          if (userSistema.fk_sistema == sistema.id) {
            return true;
          }
          return false;
        });
        const b_activo = sistemaUser ? true : false;
        return {
          ...sistema.dataValues,
          b_activo,
        };
      });

      return { data, sistemas_match };
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async getSistemasByClientes(id) {
    try {
      const data = await Sistemas.findAll();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }
  async saveSistemasByCliente(id_cliente, id) {
    try {
      const data = await TiSisCliente.create({
        fk_cliente: id_cliente,
        fk_sistema: id,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveCliente(
    nombre,
    color_primary,
    color_secundary,
    color_tercero,
    color_cuarto,
    celular,
    pais,
    ubigeo,
    organizacion,
    direccion,
    referencia,
    correo,
    status,
    cargo,
    logo_bs,
    logo_horizontal_bs,
    portada_bs
  ) {
    try {
      if (
        logo_bs &&
        logo_bs.length > 0 &&
        logo_horizontal_bs &&
        logo_horizontal_bs.length > 0 &&
        portada_bs &&
        portada_bs.length > 0
      ) {
        const data = await Cliente.create({
          nombre,
          logo: ruta_archivo1,
          logo_horizontal: ruta_archivo2,
          portada: ruta_archivo3,
          color_primary,
          color_secundary,
          color_tercero,
          color_cuarto,
          celular,
          pais,
          ubigeo,
          organizacion,
          direccion,
          referencia,
          correo,
          status: "activo",
          cargo,
        });

        const usuarioCreate = await IntAuthenticate.create({
          usuario: correo,
          clave: generatePasswordHash("123"),
          id_cliente: data.dataValues.id,
          rol_id: 1,
        });

        const ahora = Date.now();
        const currentDir = __dirname;
        const desiredDir = path.join(currentDir, "..", "..");
        let ruta_archivo1 = `/public/logos/${ahora}.png`;
        let ruta_archivo2 = `/public/logos_horizontal/${ahora}.png`;
        let ruta_archivo3 = `/public/portadas/${ahora}.png`;

        const binaryData1 = this.base64ToBinary(logo_bs);
        const binaryData2 = this.base64ToBinary(logo_horizontal_bs);
        const binaryData3 = this.base64ToBinary(portada_bs);

        await fsp.writeFile(desiredDir + ruta_archivo1, binaryData1);
        await fsp.writeFile(desiredDir + ruta_archivo2, binaryData2);
        await fsp.writeFile(desiredDir + ruta_archivo3, binaryData3);

        return data;
      } else {
        const data = await Cliente.create({
          nombre,
          logo: "",
          logo_horizontal: "",
          portada: "",
          color_primary,
          color_secundary,
          color_tercero,
          color_cuarto,
          celular,
          pais,
          ubigeo,
          organizacion,
          direccion,
          referencia,
          correo,
          status: "activo",
          cargo,
        });
        const usuarioCreate = await IntAuthenticate.create({
          usuario: correo,
          clave: generatePasswordHash("123"),
          id_cliente: data.dataValues.id,
          rol_id: 1,
        });

        return data;
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async saveSolicitud(
    fk_geoportal,
    nombres,
    apellidos,
    nacionalidad,
    tipo_documento,
    numero_documento,
    email,
    telefono_personal,
    ocupacion,
    institucion_trabajo,
    cargo,
    motivacion_geovisor,
    password
  ) {
    try {
      const data = await Solicitud.create({
        fk_geoportal,
        nombres,
        apellidos,
        nacionalidad,
        tipo_documento,
        numero_documento,
        email,
        telefono_personal,
        ocupacion,
        institucion_trabajo,
        cargo,
        motivacion_geovisor,
        password,
      });
      if (data) {
        await sendMail({
          to: email,
          name: "GEOMIDIS",
          subject: "Solicitud generada exitosamente",
          body: compileWelcomeTemplate(
            "FELICIDADES, su solicitud ha sido generada con exito, espere el correo de la confirmación de creación y entrega de credenciales."
          ),
        });
        await sendMail({
          to: "csanchez@midis.gob.pe",
          name: "GEOMIDIS",
          subject: "🚨🚨🚨 Solicitud nueva en cola 🚨🚨🚨",
          body: compileWelcomeTemplate(
            "ATENCIÓN, una nueva solicitud ha sido generada por: " +
              nombres +
              " " +
              apellidos +
              ", atender desde el geovisor."
          ),
        });
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async sendMessage(fk_geoportal, email) {
    try {
      const password = "123456@";
      const data = await TgUsuario.update(
        {
          clave: generatePasswordHash(password),
        },
        { where: { email: email, id_cliente: fk_geoportal } }
      );
      if (data) {
        await sendMail({
          to: email,
          name: "GEOMIDIS",
          subject: "Reseteo de Contraseña",
          body: compileReseteoTemplate(password),
        });
      }
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async saveGeoportales(
    nombre,
    color_primary,
    logo_bs,
    descripcion,
    componentsIzquierda,
    componentsDerecha,
    componentsMenu,
    componentsArriba
  ) {
    try {
      if (logo_bs && logo_bs.length > 0) {
        const ahora = Date.now();
        const currentDir = __dirname;
        const desiredDir = path.join(currentDir, "..", "..");
        let ruta_archivo1 = `/public/logos/${ahora}.png`;

        const data = await Geoportal.create({
          name: nombre,
          title: descripcion,
          background: color_primary,
          logo: ruta_archivo1,
        });

        if (data) {
          if (componentsIzquierda.length > 0) {
            for (let index = 0; index < componentsIzquierda.length; index++) {
              const element = componentsIzquierda[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 1,
                orden: index,
              });
            }
          }
          if (componentsDerecha.length > 0) {
            for (let index = 0; index < componentsDerecha.length; index++) {
              const element = componentsDerecha[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 2,
                orden: index,
              });
            }
          }
          if (componentsMenu.length > 0) {
            for (let index = 0; index < componentsMenu.length; index++) {
              const element = componentsMenu[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 3,
                orden: index,
              });
            }
          }
          if (componentsArriba.length > 0) {
            for (let index = 0; index < componentsArriba.length; index++) {
              const element = componentsArriba[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 4,
                orden: index,
              });
            }
          }
          const binaryData1 = this.base64ToBinary(logo_bs);
          await fsp.writeFile(desiredDir + ruta_archivo1, binaryData1);
          return data;
        } else {
          throw new Error("No se pudo registrar");
        }
      } else {
        const data = await Geoportal.create({
          name: nombre,
          title: descripcion,
          background: color_primary,
          logo: "",
        });
        if (data) {
          if (componentsIzquierda.length > 0) {
            for (let index = 0; index < componentsIzquierda.length; index++) {
              const element = componentsIzquierda[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 1,
                orden: index,
              });
            }
          }
          if (componentsDerecha.length > 0) {
            for (let index = 0; index < componentsDerecha.length; index++) {
              const element = componentsDerecha[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 2,
                orden: index,
              });
            }
          }
          if (componentsMenu.length > 0) {
            for (let index = 0; index < componentsMenu.length; index++) {
              const element = componentsMenu[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 3,
                orden: index,
              });
            }
          }
          if (componentsArriba.length > 0) {
            for (let index = 0; index < componentsArriba.length; index++) {
              const element = componentsArriba[index];
              await GeoportalComponent.create({
                fk_geoportal: data.id,
                fk_componente: element.id,
                position: 4,
                orden: index,
              });
            }
          }
          return data;
        } else {
          throw new Error("No se pudo registrar");
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio: " + error);
    }
  }

  async editGeoportales(
    id,
    nombre,
    color_primary,
    logo_bs,
    descripcion,
    componentsIzquierda,
    componentsDerecha,
    componentsMenu,
    componentsArriba
  ) {
    try {
      if (logo_bs) {
        const ahora = Date.now();
        const currentDir = __dirname;
        const desiredDir = path.join(currentDir, "..", "..");
        let ruta_archivo1 = `/public/logos/${ahora}.png`;

        const data = await Geoportal.update(
          {
            name: nombre,
            title: descripcion,
            background: color_primary,
            logo: ruta_archivo1,
          },
          {
            where: {
              id: id,
            },
          }
        );
        if (data) {
          await GeoportalComponent.destroy({ where: { fk_geoportal: id } });
          if (componentsIzquierda.length > 0) {
            for (let index = 0; index < componentsIzquierda.length; index++) {
              const element = componentsIzquierda[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 1,
                orden: index,
              });
            }
          }
          if (componentsDerecha.length > 0) {
            for (let index = 0; index < componentsDerecha.length; index++) {
              const element = componentsDerecha[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 2,
                orden: index,
              });
            }
          }
          if (componentsMenu.length > 0) {
            for (let index = 0; index < componentsMenu.length; index++) {
              const element = componentsMenu[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 3,
                orden: index,
              });
            }
          }
          if (componentsArriba.length > 0) {
            for (let index = 0; index < componentsArriba.length; index++) {
              const element = componentsArriba[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 4,
                orden: index,
              });
            }
          }
          const binaryData1 = this.base64ToBinary(logo_bs);
          await fsp.writeFile(desiredDir + ruta_archivo1, binaryData1);
          return data;
        } else {
          throw new Error("No se pudo registrar");
        }
      } else {
        const data = await Geoportal.update(
          {
            name: nombre,
            title: descripcion,
            background: color_primary,
          },
          {
            where: {
              id: id,
            },
          }
        );
        if (data) {
          await GeoportalComponent.destroy({ where: { fk_geoportal: id } });
          if (componentsIzquierda.length > 0) {
            for (let index = 0; index < componentsIzquierda.length; index++) {
              const element = componentsIzquierda[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 1,
                orden: index,
              });
            }
          }
          if (componentsDerecha.length > 0) {
            for (let index = 0; index < componentsDerecha.length; index++) {
              const element = componentsDerecha[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 2,
                orden: index,
              });
            }
          }
          if (componentsMenu.length > 0) {
            for (let index = 0; index < componentsMenu.length; index++) {
              const element = componentsMenu[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 3,
                orden: index,
              });
            }
          }
          if (componentsArriba.length > 0) {
            for (let index = 0; index < componentsArriba.length; index++) {
              const element = componentsArriba[index];
              await GeoportalComponent.create({
                fk_geoportal: id,
                fk_componente: element.id,
                position: 4,
                orden: index,
              });
            }
          }
          return data;
        } else {
          throw new Error("No se pudo registrar");
        }
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio: " + error);
    }
  }

  async deleteGeoportales(id) {
    try {
      await Geoportal.destroy({
        where: { id: id },
      });
      await GeoportalComponent.destroy({
        where: { fk_geoportal: id },
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  base64ToBinary(base64) {
    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches.length !== 3) {
      throw new Error("Base64 no válido");
    }
    return Buffer.from(matches[2], "base64");
  }

  async deleteSistemasByCliente(id_cliente, id) {
    try {
      const data = await TiSisCliente.destroy({
        where: {
          fk_cliente: id_cliente,
          fk_sistema: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }

  async deleteCliente(id) {
    try {
      const data = await Cliente.destroy({
        where: {
          id: id,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener el servicio.");
    }
  }
}

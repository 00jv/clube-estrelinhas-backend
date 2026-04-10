import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const products = [
  {
    name: "Bolsa Artesanal Solar",
    slug: "bolsa-artesanal-solar",
    price: 389.00,
    image: "/bolsa1SemFundo.png",
    tag: "NOVO",
    category: "Acessórios",
    description: "Bolsa de crochê com acabamento impecável, 100% manual e sustentável. Ideal para dias ensolarados e compor looks leves e elegantes."
  },
  {
    name: "Top Crochê Natural",
    slug: "top-croche-natural",
    price: 199.90,
    image: "/croppedSemFundo.png",
    tag: "DESTAQUE",
    category: "Vestuário",
    description: "Top feito em fio de algodão orgânico, perfeito para o verão com trama exclusiva que não agride o meio ambiente."
  },
  {
    name: "Vestido Premium Marés",
    slug: "vestido-premium-mares",
    price: 659.00,
    image: "/vestidoSemFundo.png",
    tag: "PREMIUM",
    category: "Moda Praia",
    description: "Uma obra de arte em formato de vestido. O modelo Marés traz exclusividade, conforto e elegância em fios selecionados."
  },
  {
    name: "Bolsa Encanto Brisa",
    slug: "bolsa-encanto-brisa",
    price: 499.00,
    image: "/bolsa2SemFundo.png",
    tag: null,
    category: "Acessórios",
    description: "Bolsa exclusiva em crochê para momentos inesquecíveis, trazendo sofisticação e estilo feito à mão."
  }
]

// Initial admin users — passwords should be changed after first login
const admins = [
  {
    name: "Administradora",
    email: "admin@clubeestrelinhas.com",
    password: "estrelinhas123"
  },
  {
    name: "Sócia",
    email: "socia@clubeestrelinhas.com",
    password: "estrelinhas123"
  }
]

async function main() {
  console.log('🌱 Seeding database...')

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log(`✅ ${products.length} produtos inseridos.`)

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10)
    await prisma.admin.upsert({
      where: { email: admin.email },
      update: { password: hashedPassword },
      create: { ...admin, password: hashedPassword }
    })
  }
  console.log(`✅ ${admins.length} admins criados.`)

  console.log('\n🔑 Credenciais de acesso:')
  admins.forEach(a => console.log(`   ${a.name}: ${a.email} / ${a.password}`))
  console.log('\n⚠️  Altere as senhas após o primeiro login!\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
